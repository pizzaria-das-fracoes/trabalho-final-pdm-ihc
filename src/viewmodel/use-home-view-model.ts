import { useEffect, useState } from "react";
import { container } from "@/di/container";
import type { Attempt } from "@/model/progress";

export const useHomeViewModel = () => {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void container.progressRepository
      .listAttempts()
      .then(setAttempts)
      .catch(() => setError("Não foi possível carregar seu progresso."))
      .finally(() => setLoading(false));
  }, []);

  return { attempts, loading, error };
};
