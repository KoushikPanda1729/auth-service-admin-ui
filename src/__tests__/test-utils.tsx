import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import { configureStore } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import rootReducer from "../app/rootReducer";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof configureStore>;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: rootReducer,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      preloadedState: preloadedState as any,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { readonly children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ConfigProvider>{children}</ConfigProvider>
        </BrowserRouter>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";
export { renderWithProviders as render };
