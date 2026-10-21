import { useState, type FormEvent } from 'react';

import {
  MeResponse,
  updatePassword,
} from '../api/auth';
import { getUserMessage } from '../lib/errors';

interface ProfilePageProps {
  user: MeResponse;
  onCancel: () => void;
}

function roleLabel(role: MeResponse['role']) {
  switch (role) {
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

export function ProfilePage({
  user,
  onCancel,
}: ProfilePageProps) {
  const [currentPassword, setCurrentPassword] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] =
    useState<string | null>(null);
  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage(null);
    setError(null);

    if (!currentPassword || !newPassword) {
      setError(
        'رمز عبور فعلی و رمز عبور جدید را وارد کنید.',
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        'رمز عبور جدید باید حداقل ۸ کاراکتر باشد.',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        'تکرار رمز عبور با رمز عبور جدید یکسان نیست.',
      );
      return;
    }

    try {
      setLoading(true);

      const result = await updatePassword(
        currentPassword,
        newPassword,
      );

      setMessage(result.message);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(
        getUserMessage(err, 'تغییر رمز عبور انجام نشد.'),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">
          پروفایل کاربری
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          اطلاعات حساب و امنیت حساب کاربری
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-black text-slate-900">
            اطلاعات حساب
          </h2>

          <div className="mt-6 space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-400">
                ایمیل
              </div>

              <div
                dir="ltr"
                className="mt-1 text-sm font-bold text-slate-800"
              >
                {user.email}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-400">
                نقش
              </div>

              <div className="mt-1 text-sm font-bold text-slate-800">
                {roleLabel(user.role)}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-400">
                شناسه داروخانه
              </div>

              <div
                dir="ltr"
                className="mt-1 break-all text-sm font-bold text-slate-800"
              >
                {user.pharmacyId ?? 'متصل نیست'}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-black text-slate-900">
            تغییر رمز عبور
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            <div>
              <label htmlFor="profile-field-1" className="mb-2 block text-xs font-bold text-slate-700">
                رمز عبور فعلی
              </label>

              <input id="profile-field-1"
                type="password"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                autoComplete="current-password"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-medical-500 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="profile-field-2" className="mb-2 block text-xs font-bold text-slate-700">
                رمز عبور جدید
              </label>

              <input id="profile-field-2"
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                autoComplete="new-password"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-medical-500 focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="profile-field-3" className="mb-2 block text-xs font-bold text-slate-700">
                تکرار رمز عبور جدید
              </label>

              <input id="profile-field-3"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                autoComplete="new-password"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-medical-500 focus:bg-white"
              />
            </div>

            {error && (
              <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            {message && (
              <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                {message}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-medical-600 text-sm font-extrabold text-white transition hover:bg-medical-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? 'در حال تغییر...'
                  : 'تغییر رمز عبور'}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={onCancel}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white text-sm font-extrabold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                انصراف
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
