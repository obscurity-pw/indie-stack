import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: "This email is already in use!",
          password: null,
        },
      },
      { status: 400 }
    );
  }

  const user = await createUser(email, password);

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user.id,
  });
};

export const meta: V2_MetaFunction = () => [{ title: "register - obscurity" }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full bg-black flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
      <div className="h-2 bg-purple-500 rounded-t-md"></div>
      <div className="container">
      <div className="content" data-light="">
        <h1 className="pb-4">OBSCURITY</h1>
        <Form method="post" className="space-y-6">
          <div>
            <div className="mt-1">
              <input
                ref={emailRef}
                id="email"
                required
                autoFocus={false}
                placeholder="email adress"
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full border border-purple-500 px-2 focus:border-purple-500 placeholder:text-sm bg-black text-white active:border-purple-500 py-1 text-lg"
              />
              {actionData?.errors?.email ? (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.email}
                </div>
              ) : null}
            </div>
          </div>
          <div>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                placeholder="password"
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full border border-purple-500 px-2 bg-black placeholder:text-sm text-white focus:border-purple-500 py-1 text-lg"
              />
              {actionData?.errors?.password ? (
                <div className="pt-1 text-red-700" id="password-error">
                  {actionData.errors.password}
                </div>
              ) : null}
            </div>
          </div>
         
          <div>
            <div className="mt-1">
              <input
                id="invCode"
                ref={passwordRef}
                placeholder="invite code"
                name="invCode"
                type="text"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="invite-error"
                className="w-full border border-purple-500 px-2 bg-black placeholder:text-sm text-white focus:border-purple-500 py-1 text-lg"
              />
              {actionData?.errors?.password ? (
                <div className="pt-1 text-red-700" id="invite-error">
                  {actionData.errors.password}
                </div>
              ) : null}
            </div>
          </div>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="w-full rounded border border-purple-500 bg-black px-4 py-2 text-white hover:bg-purple-500 hover:text-black focus:bg-purple-500"
          >
            submit
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              already have an account?{" "}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
    </div>
    </div>
  );
}
