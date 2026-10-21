import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AlertTriangle,
  KeyRound,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
  Users,
  X,
} from 'lucide-react';

import {
  createUser,
  deleteUser,
  getUsers,
  resetUserPassword,
  updateUser,
  updateUserStatus,
  CreateUserRequest,
  UpdateUserRequest,
  UserItem,
} from '../api/users';

import { MeResponse } from '../api/auth';
import { Pharmacy } from '../types';

interface AdminUsersPageProps {
  pharmacies: Pharmacy[];
  currentUser: MeResponse;
}

function roleLabel(role: UserItem['role']) {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'مدیر ارشد سامانه';

    case 'PLATFORM_ADMIN':
      return 'مدیر پلتفرم';

    case 'PHARMACY_OWNER':
      return 'مالک داروخانه';

    case 'PHARMACY_STAFF':
      return 'کارمند داروخانه';

    default:
      return role;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export const AdminUsersPage: React.FC<
  AdminUsersPageProps
> = ({
  pharmacies,
  currentUser,
}) => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] =
    useState<string | null>(null);
  const [resettingPassword, setResettingPassword] =
    useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] =
    useState<'ALL' | UserItem['role']>('ALL');

  const [pharmacyFilter, setPharmacyFilter] =
    useState('ALL');

  const [statusFilter, setStatusFilter] =
    useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  const [creatingUser, setCreatingUser] =
    useState(false);

  const [createEmail, setCreateEmail] =
    useState('');

  const [createPassword, setCreatePassword] =
    useState('');

  const [createPasswordConfirm, setCreatePasswordConfirm] =
    useState('');

  const [createRole, setCreateRole] =
    useState<UserItem['role']>('PHARMACY_STAFF');

  const [createPharmacyId, setCreatePharmacyId] =
    useState('');

  const [editingUser, setEditingUser] =
    useState<UserItem | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<UserItem | null>(null);

  const [editEmail, setEditEmail] =
    useState('');

  const [editRole, setEditRole] =
    useState<UserItem['role']>('PHARMACY_STAFF');

  const [editPharmacyId, setEditPharmacyId] =
    useState('');

  const [resetTarget, setResetTarget] =
    useState<UserItem | null>(null);
  const [resetPassword, setResetPassword] =
    useState('');
  const [resetPasswordConfirm, setResetPasswordConfirm] =
    useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const result = await getUsers();
      setUsers(result);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : 'دریافت فهرست کاربران با خطا مواجه شد.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const pharmacyMap = useMemo(() => {
    return new Map(
      pharmacies.map((pharmacy) => [
        pharmacy.id,
        pharmacy,
      ]),
    );
  }, [pharmacies]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const pharmacyName = user.pharmacyId
        ? pharmacyMap.get(user.pharmacyId)?.name ?? ''
        : '';

      const matchesSearch =
        !query ||
        [
          user.email,
          roleLabel(user.role),
          pharmacyName,
        ]
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesRole =
        roleFilter === 'ALL' ||
        user.role === roleFilter;

      const matchesPharmacy =
        pharmacyFilter === 'ALL' ||
        user.pharmacyId === pharmacyFilter;

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && user.isActive) ||
        (statusFilter === 'INACTIVE' && !user.isActive);

      return (
        matchesSearch &&
        matchesRole &&
        matchesPharmacy &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    pharmacyFilter,
    statusFilter,
    pharmacyMap,
  ]);

  const superAdminCount = users.filter(
    (user) => user.role === 'SUPER_ADMIN',
  ).length;

  const platformAdminCount = users.filter(
    (user) => user.role === 'PLATFORM_ADMIN',
  ).length;

  const ownerCount = users.filter(
    (user) => user.role === 'PHARMACY_OWNER',
  ).length;

  const staffCount = users.filter(
    (user) => user.role === 'PHARMACY_STAFF',
  ).length;

  function closeCreateUser() {
    if (saving) {
      return;
    }

    setCreatingUser(false);
    setCreateEmail('');
    setCreatePassword('');
    setCreatePasswordConfirm('');
    setCreateRole('PHARMACY_STAFF');
    setCreatePharmacyId('');
  }

  function handleCreateRoleChange(
    role: UserItem['role'],
  ) {
    setCreateRole(role);

    if (
      role === 'SUPER_ADMIN' ||
      role === 'PLATFORM_ADMIN'
    ) {
      setCreatePharmacyId('');
    }
  }

  async function handleCreateUser() {
    const email = createEmail.trim();

    if (!email) {
      setError('ایمیل کاربر الزامی است.');
      return;
    }

    if (createPassword.length < 8) {
      setError('رمز موقت باید حداقل ۸ کاراکتر باشد.');
      return;
    }

    if (createPassword !== createPasswordConfirm) {
      setError('تکرار رمز موقت با رمز اصلی یکسان نیست.');
      return;
    }

    if (
      currentUser.role === 'PLATFORM_ADMIN' &&
      createRole === 'SUPER_ADMIN'
    ) {
      setError(
        'مدیر پلتفرم اجازه ایجاد Super Admin را ندارد.',
      );
      return;
    }

    if (
      createRole !== 'SUPER_ADMIN' &&
      createRole !== 'PLATFORM_ADMIN' &&
      !createPharmacyId
    ) {
      setError(
        'برای مالک یا کارمند، انتخاب داروخانه الزامی است.',
      );
      return;
    }

    const payload: CreateUserRequest = {
      email,
      password: createPassword,
      role: createRole,
      pharmacyId:
        createRole === 'SUPER_ADMIN' ||
        createRole === 'PLATFORM_ADMIN'
          ? null
          : createPharmacyId,
    };

    const confirmed = window.confirm(
      `آیا از ایجاد کاربر با نقش «${roleLabel(createRole)}» مطمئن هستید؟\n\nرمز واردشده به عنوان رمز موقت ثبت خواهد شد.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const created = await createUser(payload);

      setUsers((current) => [
        created,
        ...current.filter(
          (user) => user.id !== created.id,
        ),
      ]);

      setSuccess(
        `کاربر ${created.email} با موفقیت ایجاد شد. رمز فعلی برای او موقت است.`,
      );

      closeCreateUser();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : 'ایجاد کاربر با خطا مواجه شد.',
      );
    } finally {
      setSaving(false);
    }
  }

  function openEdit(user: UserItem) {
    if (
      currentUser.role === 'PLATFORM_ADMIN' &&
      user.role === 'SUPER_ADMIN'
    ) {
      setError(
        'مدیر پلتفرم اجازه ویرایش Super Admin را ندارد.',
      );
      return;
    }

    setError('');
    setSuccess('');

    setEditingUser(user);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditPharmacyId(user.pharmacyId ?? '');
  }

  function closeEdit() {
    if (saving) {
      return;
    }

    setEditingUser(null);
    setEditEmail('');
    setEditRole('PHARMACY_STAFF');
    setEditPharmacyId('');
  }

  function handleRoleChange(
    role: UserItem['role'],
  ) {
    setEditRole(role);

    if (
      role === 'SUPER_ADMIN' ||
      role === 'PLATFORM_ADMIN'
    ) {
      setEditPharmacyId('');
    }
  }

  async function handleSave() {
    if (!editingUser) {
      return;
    }

    const email = editEmail.trim();

    if (!email) {
      setError('ایمیل کاربر الزامی است.');
      return;
    }

    if (
      editingUser.id === currentUser.id &&
      editRole !== editingUser.role
    ) {
      setError(
        'برای امنیت، امکان تغییر نقش حساب کاربری خودتان وجود ندارد.',
      );
      return;
    }

    if (
      editingUser.id === currentUser.id &&
      editPharmacyId !==
        (editingUser.pharmacyId ?? '')
    ) {
      setError(
        'برای امنیت، امکان تغییر داروخانه حساب کاربری خودتان وجود ندارد.',
      );
      return;
    }

    if (
      editRole !== 'SUPER_ADMIN' &&
      editRole !== 'PLATFORM_ADMIN' &&
      !editPharmacyId
    ) {
      setError(
        'برای مالک یا کارمند، انتخاب داروخانه الزامی است.',
      );
      return;
    }

    if (
      (
        editRole === 'SUPER_ADMIN' ||
        editRole === 'PLATFORM_ADMIN'
      ) &&
      editPharmacyId
    ) {
      setError(
        'کاربر مدیر سامانه نباید به داروخانه متصل باشد.',
      );
      return;
    }

    if (
      currentUser.role === 'PLATFORM_ADMIN' &&
      editingUser.role === 'SUPER_ADMIN'
    ) {
      setError(
        'مدیر پلتفرم اجازه مدیریت Super Admin را ندارد.',
      );
      return;
    }

    if (
      currentUser.role === 'PLATFORM_ADMIN' &&
      editRole === 'SUPER_ADMIN'
    ) {
      setError(
        'مدیر پلتفرم اجازه ایجاد یا ارتقای Super Admin را ندارد.',
      );
      return;
    }

    const roleChanged =
      editRole !== editingUser.role;

    const pharmacyChanged =
      editPharmacyId !==
      (editingUser.pharmacyId ?? '');

    if (roleChanged || pharmacyChanged) {
      const confirmed = window.confirm(
        'این تغییر می‌تواند سطح دسترسی یا محدوده دسترسی کاربر را تغییر دهد. آیا از ادامه عملیات مطمئن هستید؟',
      );

      if (!confirmed) {
        return;
      }
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const payload: UpdateUserRequest = {
        email,
      };

      if (editRole !== editingUser.role) {
        payload.role = editRole;
      }

      if (pharmacyChanged) {
        payload.pharmacyId =
          editPharmacyId || null;
      }

      const updated = await updateUser(
        editingUser.id,
        payload,
      );

      setUsers((current) =>
        current.map((user) =>
          user.id === updated.id
            ? updated
            : user,
        ),
      );

      setSuccess(
        'اطلاعات کاربر با موفقیت بروزرسانی شد.',
      );

      closeEdit();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : 'ویرایش کاربر انجام نشد.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(user: UserItem) {
    if (user.id === currentUser.id) {
      setError(
        'برای امنیت، امکان تغییر وضعیت حساب کاربری خودتان وجود ندارد.',
      );
      return;
    }

    if (
      currentUser.role === 'PLATFORM_ADMIN' &&
      user.role === 'SUPER_ADMIN'
    ) {
      setError(
        'مدیر پلتفرم اجازه تغییر وضعیت Super Admin را ندارد.',
      );
      return;
    }

    const nextStatus = !user.isActive;

    const confirmed = window.confirm(
      nextStatus
        ? `آیا از فعال‌سازی حساب ${user.email} مطمئن هستید؟`
        : `آیا از غیرفعال‌سازی حساب ${user.email} مطمئن هستید؟`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setStatusUpdatingId(user.id);
      setError('');
      setSuccess('');

      const updated = await updateUserStatus(
        user.id,
        nextStatus,
      );

      setUsers((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      );

      setSuccess(
        nextStatus
          ? 'حساب کاربر فعال شد.'
          : 'حساب کاربر غیرفعال شد.',
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : 'تغییر وضعیت کاربر انجام نشد.',
      );
    } finally {
      setStatusUpdatingId(null);
    }
  }

  function openResetPassword(user: UserItem) {
    if (user.id === currentUser.id) {
      setError(
        'برای امنیت، امکان Reset Password حساب کاربری خودتان از این بخش وجود ندارد.',
      );
      return;
    }

    if (
      currentUser.role === 'PLATFORM_ADMIN' &&
      user.role === 'SUPER_ADMIN'
    ) {
      setError(
        'مدیر پلتفرم اجازه Reset رمز Super Admin را ندارد.',
      );
      return;
    }

    setError('');
    setSuccess('');
    setResetTarget(user);
    setResetPassword('');
    setResetPasswordConfirm('');
  }

  function closeResetPassword() {
    if (resettingPassword) {
      return;
    }

    setResetTarget(null);
    setResetPassword('');
    setResetPasswordConfirm('');
  }

  async function handleResetPassword() {
    if (!resetTarget) {
      return;
    }

    if (resetPassword.length < 8) {
      setError('رمز عبور جدید باید حداقل ۸ کاراکتر باشد.');
      return;
    }

    if (resetPassword !== resetPasswordConfirm) {
      setError('تکرار رمز عبور با رمز جدید یکسان نیست.');
      return;
    }

    const confirmed = window.confirm(
      `آیا از تعیین رمز موقت جدید برای ${resetTarget.email} مطمئن هستید؟ کاربر پس از ورود مجبور به تغییر رمز خواهد بود.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setResettingPassword(true);
      setError('');
      setSuccess('');

      const updated = await resetUserPassword(
        resetTarget.id,
        resetPassword,
      );

      setUsers((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      );

      setSuccess(
        'رمز عبور کاربر با موفقیت Reset شد و کاربر در ورود بعدی باید رمز خود را تغییر دهد.',
      );

      closeResetPassword();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : 'Reset رمز عبور انجام نشد.',
      );
    } finally {
      setResettingPassword(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    if (deleteTarget.id === currentUser.id) {
      setError(
        'برای امنیت، امکان حذف حساب کاربری خودتان وجود ندارد.',
      );
      setDeleteTarget(null);
      return;
    }

    if (
      currentUser.role === 'PLATFORM_ADMIN' &&
      deleteTarget.role === 'SUPER_ADMIN'
    ) {
      setError(
        'مدیر پلتفرم اجازه حذف Super Admin را ندارد.',
      );
      setDeleteTarget(null);
      return;
    }

    try {
      setDeleting(true);
      setError('');
      setSuccess('');

      await deleteUser(deleteTarget.id);

      setUsers((current) =>
        current.filter(
          (user) =>
            user.id !== deleteTarget.id,
        ),
      );

      setSuccess(
        'کاربر با موفقیت حذف شد.',
      );

      setDeleteTarget(null);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : 'حذف کاربر انجام نشد.',
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section
      dir="rtl"
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Users className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                مدیریت کاربران
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                مدیریت امن کاربران، نقش‌ها و دسترسی داروخانه‌ها
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setError('');
              setSuccess('');
              setCreatingUser(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-medical-700"
          >
            <Plus className="h-4 w-4" />
            ایجاد کاربر
          </button>

          <button
            type="button"
            onClick={() => void loadUsers()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-medical-200 hover:bg-medical-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? 'animate-spin' : ''
              }`}
            />
            بروزرسانی
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          {success}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-500">
            کل کاربران
          </div>

          <div className="mt-2 text-3xl font-black text-slate-900">
            {users.length}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <div className="text-xs font-bold text-amber-700">
            مدیر ارشد سامانه
          </div>

          <div className="mt-2 text-3xl font-black text-amber-800">
            {superAdminCount}
          </div>

          <div className="mt-1 text-[11px] font-semibold text-amber-700">
            SUPER ADMIN
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <div className="text-xs font-bold text-emerald-700">
            مدیران پلتفرم
          </div>

          <div className="mt-2 text-3xl font-black text-emerald-800">
            {platformAdminCount}
          </div>

          <div className="mt-1 text-[11px] font-semibold text-emerald-700">
            PLATFORM ADMIN
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <div className="text-xs font-bold text-blue-700">
            مالکان داروخانه
          </div>

          <div className="mt-2 text-3xl font-black text-blue-800">
            {ownerCount}
          </div>
        </div>

        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 shadow-sm">
          <div className="text-xs font-bold text-violet-700">
            کارکنان
          </div>

          <div className="mt-2 text-3xl font-black text-violet-800">
            {staffCount}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h3 className="font-black text-slate-900">
              فهرست کاربران
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {filteredUsers.length} کاربر نمایش داده می‌شود
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="جستجوی کاربر..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-3 text-sm outline-none transition focus:border-medical-500 focus:bg-white focus:ring-2 focus:ring-medical-100"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(
                  event.target.value as
                    | 'ALL'
                    | UserItem['role'],
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-medical-500 focus:ring-2 focus:ring-medical-100"
            >
              <option value="ALL">
                همه نقش‌ها
              </option>
              <option value="SUPER_ADMIN">
                مدیر ارشد سامانه
              </option>

              <option value="PLATFORM_ADMIN">
                مدیر پلتفرم
              </option>
              <option value="PHARMACY_OWNER">
                مالک داروخانه
              </option>
              <option value="PHARMACY_STAFF">
                کارمند داروخانه
              </option>
            </select>

            <select
              value={pharmacyFilter}
              onChange={(event) =>
                setPharmacyFilter(
                  event.target.value,
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-medical-500 focus:ring-2 focus:ring-medical-100"
            >
              <option value="ALL">
                همه داروخانه‌ها
              </option>

              {pharmacies.map((pharmacy) => (
                <option
                  key={pharmacy.id}
                  value={pharmacy.id}
                >
                  {pharmacy.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | 'ALL'
                    | 'ACTIVE'
                    | 'INACTIVE',
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-medical-500 focus:ring-2 focus:ring-medical-100"
            >
              <option value="ALL">
                همه وضعیت‌ها
              </option>
              <option value="ACTIVE">
                فعال
              </option>
              <option value="INACTIVE">
                غیرفعال
              </option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1350px] w-full text-right">
            <thead className="bg-slate-50">
              <tr className="text-xs font-black text-slate-500">
                <th className="px-5 py-4">
                  کاربر
                </th>

                <th className="px-5 py-4">
                  نقش
                </th>

                <th className="px-5 py-4">
                  داروخانه
                </th>

                <th className="px-5 py-4">
                  وضعیت
                </th>

                <th className="px-5 py-4">
                  آخرین ورود
                </th>

                <th className="px-5 py-4">
                  تاریخ ایجاد
                </th>

                <th className="px-5 py-4">
                  آخرین بروزرسانی
                </th>

                <th className="px-5 py-4">
                  عملیات
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    در حال دریافت کاربران...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    کاربری برای نمایش وجود ندارد.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const pharmacy =
                    user.pharmacyId
                      ? pharmacyMap.get(
                          user.pharmacyId,
                        )
                      : undefined;

                  const isSelf =
                    user.id === currentUser.id;

                  const cannotManage =
                    currentUser.role === 'PLATFORM_ADMIN' &&
                    user.role === 'SUPER_ADMIN';

                  return (
                    <tr
                      key={user.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div
                          dir="ltr"
                          className="font-bold text-slate-800"
                        >
                          {user.email}
                        </div>

                        <div
                          dir="ltr"
                          className="mt-1 text-[10px] text-slate-400"
                        >
                          {user.id}
                        </div>

                        {isSelf && (
                          <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                            حساب شما
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
                          {(user.role === 'SUPER_ADMIN' ||
                            user.role === 'PLATFORM_ADMIN') && (
                            <ShieldCheck
                              className={`h-3.5 w-3.5 ${
                                user.role === 'SUPER_ADMIN'
                                  ? 'text-amber-600'
                                  : 'text-emerald-600'
                              }`}
                            />
                          )}

                          {user.role ===
                            'PHARMACY_OWNER' && (
                            <UserCheck className="h-3.5 w-3.5 text-blue-600" />
                          )}

                          {roleLabel(user.role)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {pharmacy ? (
                          <div>
                            <div className="font-bold text-slate-800">
                              {pharmacy.avatar}{' '}
                              {pharmacy.name}
                            </div>

                            <div className="mt-1 text-xs text-slate-400">
                              {pharmacy.city}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">
                            بدون داروخانه
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <span
                            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                              user.isActive
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {user.isActive ? (
                              <UserCheck className="h-3.5 w-3.5" />
                            ) : (
                              <UserX className="h-3.5 w-3.5" />
                            )}
                            {user.isActive ? 'فعال' : 'غیرفعال'}
                          </span>

                        </div>
                      </td>

                      <td className="px-5 py-4 text-xs font-medium text-slate-500">
                        {user.lastLoginAt
                          ? formatDate(user.lastLoginAt)
                          : 'هنوز وارد نشده'}
                      </td>

                      <td className="px-5 py-4 text-xs font-medium text-slate-500">
                        {formatDate(
                          user.createdAt,
                        )}
                      </td>

                      <td className="px-5 py-4 text-xs font-medium text-slate-500">
                        {formatDate(
                          user.updatedAt,
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEdit(user)
                            }
                            disabled={cannotManage}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-medical-300 hover:bg-medical-50 hover:text-medical-700"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            ویرایش
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void handleToggleStatus(user)
                            }
                            disabled={
                              isSelf ||
                              cannotManage ||
                              statusUpdatingId === user.id
                            }
                            className={`inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                              user.isActive
                                ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                                : 'border-medical-200 text-medical-700 hover:bg-medical-50'
                            }`}
                          >
                            {user.isActive ? (
                              <UserX className="h-3.5 w-3.5" />
                            ) : (
                              <UserCheck className="h-3.5 w-3.5" />
                            )}
                            {statusUpdatingId === user.id
                              ? 'در حال تغییر...'
                              : user.isActive
                                ? 'غیرفعال'
                                : 'فعال'}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openResetPassword(user)
                            }
                            disabled={isSelf || cannotManage}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <KeyRound className="h-3.5 w-3.5" />
                            Reset رمز
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget(user)
                            }
                            disabled={isSelf || cannotManage}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {creatingUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 p-4">
          <div
            dir="rtl"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  ایجاد کاربر جدید
                </h3>

                <p className="mt-1 text-xs leading-6 text-slate-400">
                  رمز واردشده به صورت موقت ثبت می‌شود و کاربر در اولین ورود باید آن را تغییر دهد.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateUser}
                disabled={saving}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  ایمیل
                </label>

                <input
                  dir="ltr"
                  type="email"
                  autoComplete="off"
                  value={createEmail}
                  onChange={(event) =>
                    setCreateEmail(event.target.value)
                  }
                  disabled={saving}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-medical-500 focus:bg-white focus:ring-2 focus:ring-medical-100"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  نقش کاربر
                </label>

                <select
                  value={createRole}
                  onChange={(event) =>
                    handleCreateRoleChange(
                      event.target.value as UserItem['role'],
                    )
                  }
                  disabled={saving}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-medical-500 focus:bg-white focus:ring-2 focus:ring-medical-100"
                >
                  {currentUser.role === 'SUPER_ADMIN' && (
                    <option value="SUPER_ADMIN">
                      مدیر ارشد سامانه
                    </option>
                  )}

                  <option value="PLATFORM_ADMIN">
                    مدیر پلتفرم
                  </option>

                  <option value="PHARMACY_OWNER">
                    مالک داروخانه
                  </option>

                  <option value="PHARMACY_STAFF">
                    کارمند داروخانه
                  </option>
                </select>
              </div>

              {createRole !== 'SUPER_ADMIN' &&
                createRole !== 'PLATFORM_ADMIN' && (
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      داروخانه
                    </label>

                    <select
                      value={createPharmacyId}
                      onChange={(event) =>
                        setCreatePharmacyId(
                          event.target.value,
                        )
                      }
                      disabled={saving}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-medical-500 focus:bg-white focus:ring-2 focus:ring-medical-100"
                    >
                      <option value="">
                        انتخاب داروخانه
                      </option>

                      {pharmacies.map((pharmacy) => (
                        <option
                          key={pharmacy.id}
                          value={pharmacy.id}
                        >
                          {pharmacy.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  رمز موقت
                </label>

                <input
                  dir="ltr"
                  type="password"
                  autoComplete="new-password"
                  value={createPassword}
                  onChange={(event) =>
                    setCreatePassword(event.target.value)
                  }
                  disabled={saving}
                  minLength={8}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-medical-500 focus:bg-white focus:ring-2 focus:ring-medical-100"
                  placeholder="حداقل ۸ کاراکتر"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  تکرار رمز موقت
                </label>

                <input
                  dir="ltr"
                  type="password"
                  autoComplete="new-password"
                  value={createPasswordConfirm}
                  onChange={(event) =>
                    setCreatePasswordConfirm(
                      event.target.value,
                    )
                  }
                  disabled={saving}
                  minLength={8}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-medical-500 focus:bg-white focus:ring-2 focus:ring-medical-100"
                  placeholder="تکرار رمز موقت"
                />
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-6 text-emerald-800">
                پس از ایجاد حساب، کاربر فعال خواهد بود؛ اما رمز واردشده موقت است و در اولین ورود باید تغییر کند.
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-6 sm:flex-row sm:justify-start">
              <button
                type="button"
                onClick={closeCreateUser}
                disabled={saving}
                className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={() => void handleCreateUser()}
                disabled={saving}
                className="h-11 rounded-xl bg-medical-600 px-6 text-sm font-bold text-white transition hover:bg-medical-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'در حال ایجاد...' : 'ایجاد کاربر'}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
          <div
            dir="rtl"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  ویرایش کاربر
                </h3>

                <p
                  dir="ltr"
                  className="mt-1 text-xs text-slate-400"
                >
                  {editingUser.email}
                </p>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  ایمیل
                </label>

                <input
                  dir="ltr"
                  type="email"
                  value={editEmail}
                  onChange={(event) =>
                    setEditEmail(
                      event.target.value,
                    )
                  }
                  disabled={saving}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-medical-500 focus:bg-white focus:ring-2 focus:ring-medical-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  نقش کاربر
                </label>

                <select
                  value={editRole}
                  onChange={(event) =>
                    handleRoleChange(
                      event.target.value as UserItem['role'],
                    )
                  }
                  disabled={
                    saving ||
                    editingUser.id ===
                      currentUser.id
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-medical-500 focus:bg-white focus:ring-2 focus:ring-medical-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option
                    value="SUPER_ADMIN"
                    disabled={
                      currentUser.role === 'PLATFORM_ADMIN'
                    }
                  >
                    مدیر ارشد سامانه
                  </option>

                  <option value="PLATFORM_ADMIN">
                    مدیر پلتفرم
                  </option>

                  <option value="PHARMACY_OWNER">
                    مالک داروخانه
                  </option>

                  <option value="PHARMACY_STAFF">
                    کارمند داروخانه
                  </option>
                </select>
              </div>

              {editRole !== 'SUPER_ADMIN' &&
                editRole !== 'PLATFORM_ADMIN' && (
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    داروخانه
                  </label>

                  <select
                    value={editPharmacyId}
                    onChange={(event) =>
                      setEditPharmacyId(
                        event.target.value,
                      )
                    }
                    disabled={saving}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none focus:border-medical-500 focus:bg-white focus:ring-2 focus:ring-medical-100"
                  >
                    <option value="">
                      انتخاب داروخانه
                    </option>

                    {pharmacies.map(
                      (pharmacy) => (
                        <option
                          key={pharmacy.id}
                          value={pharmacy.id}
                        >
                          {pharmacy.name} -{' '}
                          {pharmacy.city}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              )}

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                  <div>
                    <div className="text-sm font-black text-amber-900">
                      نکته امنیتی
                    </div>

                    <p className="mt-1 text-xs leading-6 text-amber-800">
                      تغییر نقش یا داروخانه می‌تواند سطح دسترسی کاربر را تغییر دهد و قبل از ثبت نیازمند تأیید است. Super Admin بالاترین سطح دسترسی سامانه را دارد و فقط توسط Super Admin قابل مدیریت است. رمز عبور از این بخش قابل تغییر نیست.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-6 sm:flex-row sm:justify-start">
              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={() =>
                  void handleSave()
                }
                disabled={saving}
                className="h-11 rounded-xl bg-medical-600 px-6 text-sm font-bold text-white transition hover:bg-medical-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? 'در حال ذخیره...'
                  : 'ذخیره تغییرات'}
              </button>
            </div>
          </div>
        </div>
      )}

      {resetTarget && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center bg-slate-950/50 p-4">
          <div
            dir="rtl"
            className="w-full max-w-md rounded-3xl bg-white shadow-2xl"
          >
            <div className="border-b border-slate-100 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <KeyRound className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Reset رمز عبور
                  </h3>

                  <p
                    dir="ltr"
                    className="mt-1 text-xs text-slate-400"
                  >
                    {resetTarget.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-800">
                رمز جدید به عنوان رمز موقت ثبت می‌شود و کاربر در
                اولین ورود مجبور به تغییر آن خواهد بود.
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  رمز عبور جدید
                </label>

                <input
                  dir="ltr"
                  type="password"
                  autoComplete="new-password"
                  value={resetPassword}
                  onChange={(event) =>
                    setResetPassword(event.target.value)
                  }
                  disabled={resettingPassword}
                  minLength={8}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-medical-500 focus:bg-white focus:ring-2 focus:ring-medical-100"
                  placeholder="حداقل ۸ کاراکتر"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  تکرار رمز عبور
                </label>

                <input
                  dir="ltr"
                  type="password"
                  autoComplete="new-password"
                  value={resetPasswordConfirm}
                  onChange={(event) =>
                    setResetPasswordConfirm(
                      event.target.value,
                    )
                  }
                  disabled={resettingPassword}
                  minLength={8}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-medical-500 focus:bg-white focus:ring-2 focus:ring-medical-100"
                  placeholder="تکرار رمز جدید"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-6 sm:flex-row sm:justify-start">
              <button
                type="button"
                onClick={closeResetPassword}
                disabled={resettingPassword}
                className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={() =>
                  void handleResetPassword()
                }
                disabled={resettingPassword}
                className="h-11 rounded-xl bg-amber-600 px-6 text-sm font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resettingPassword
                  ? 'در حال Reset...'
                  : 'تعیین رمز موقت'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4">
          <div
            dir="rtl"
            className="w-full max-w-md rounded-3xl bg-white shadow-2xl"
          >
            <div className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <AlertTriangle className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-lg font-black text-slate-900">
                حذف کاربر
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                آیا از حذف این کاربر مطمئن هستید؟ این عملیات می‌تواند غیرقابل بازگشت باشد.
              </p>

              <div
                dir="ltr"
                className="mt-4 rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700"
              >
                {deleteTarget.email}
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-100 p-6">
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
                disabled={deleting}
                className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={() =>
                  void handleDelete()
                }
                disabled={deleting}
                className="h-11 flex-1 rounded-xl bg-rose-600 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {deleting
                  ? 'در حال حذف...'
                  : 'حذف کاربر'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
