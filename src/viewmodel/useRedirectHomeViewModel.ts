import { type Href, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";

export type RedirectHomeState = {
  targetRoute: string;
};

export type RedirectHomeActions = {
  handleRedirectNow: () => void;
};

export function useRedirectHomeViewModel(): [RedirectHomeState, RedirectHomeActions] {
  const router = useRouter();

  const handleRedirectNow = useCallback(() => {
    router.replace("/home" as Href);
  }, [router]);

  useEffect(() => {
    router.replace("/home" as Href);
  }, [router]);

  return [{ targetRoute: "/home" }, { handleRedirectNow }];
}
