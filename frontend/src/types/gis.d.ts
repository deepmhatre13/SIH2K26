// Minimal typings for the Google Identity Services client script (gsi/client).
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            auto_select?: boolean;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          renderButton: (parent: HTMLElement, options: {
            type?: string;
            theme?: string;
            size?: string;
            text?: string;
            shape?: string;
            logo_alignment?: string;
            width?: number;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export {};