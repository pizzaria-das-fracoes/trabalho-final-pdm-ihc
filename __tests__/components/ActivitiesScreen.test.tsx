import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import * as ReactNative from "react-native";
import ActivitiesScreen from "@/view/activities";
import { useRouter } from "expo-router";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  Href: {},
}));

describe("ActivitiesScreen — redirecionamento automático e botão manual", () => {
  const replace = jest.fn();
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useRouter).mockReturnValue({
      replace,
      push,
      back: jest.fn(),
    } as never);

    ReactNative.Dimensions.set({
      window: { width: 750, height: 1334, scale: 2, fontScale: 1 },
      screen: { width: 750, height: 1334, scale: 2, fontScale: 1 },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    ReactNative.Dimensions.set({
      window: { width: 750, height: 1334, scale: 2, fontScale: 1 },
      screen: { width: 750, height: 1334, scale: 2, fontScale: 1 },
    });
  });

  it("renderiza mensagem de redirecionamento e botão 'Ir para o Mapa'", async () => {
    await render(<ActivitiesScreen />);

    await waitFor(() => {
      expect(screen.getByText("Redirecionando para /home...")).toBeTruthy();
    });

    expect(screen.getByRole("button", { name: "Ir para o Mapa" })).toBeTruthy();
  });

  it("redireciona automaticamente ao montar via useEffect", async () => {
    await render(<ActivitiesScreen />);

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/home");
    });
  });

  it("ação manual handleRedirectNow chama router.replace('/home')", async () => {
    await render(<ActivitiesScreen />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Ir para o Mapa" })).toBeTruthy();
    });

    await fireEvent.press(screen.getByRole("button", { name: "Ir para o Mapa" }));

    expect(replace).toHaveBeenCalledTimes(2);
    expect(replace).toHaveBeenLastCalledWith("/home");
  });

  it("renderiza layout compacto", async () => {
    const { rerender } = await render(<ActivitiesScreen />);
    await waitFor(() => expect(screen.getByText("Redirecionando para /home...")).toBeTruthy());

    ReactNative.Dimensions.set({
      window: { width: 360, height: 640, scale: 2, fontScale: 1 },
      screen: { width: 360, height: 640, scale: 2, fontScale: 1 },
    });
    await rerender(<ActivitiesScreen />);

    await waitFor(() => {
      expect(screen.getByText("Redirecionando para /home...")).toBeTruthy();
      expect(screen.getByRole("button", { name: "Ir para o Mapa" })).toBeTruthy();
    });
  });
});