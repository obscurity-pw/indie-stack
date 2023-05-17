import type { V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import Particles from 'react-particles-js';

import { useOptionalUser } from "~/utils";

export const meta: V2_MetaFunction = () => [{ title: "obscurity" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-black sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
              <h1 className="text-center tracking-normal">
                OBSCURITY
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div id="Footer">
        <Link id="link_Styles"
          to="/login"
        >
          login 
        </Link>
       <a> / </a>
        <Link id="link_Styles"
          to="/join"
        >
          register
        </Link>
      </div>
    </main>
  );
}
