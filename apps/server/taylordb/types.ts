/**
 * Copyright (c) 2025 TaylorDB
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  autoNumberField,
  defineTaylorSchema,
  numberField,
  searchField,
  textField,
} from '@taylordb/query-builder';
import type { InferTaylorDatabase } from '@taylordb/query-builder';

export const taylorSchema = defineTaylorSchema({
  attachmentTable: {
    id: autoNumberField(),
    name: textField({ required: true }),
    metadata: textField({ required: true }),
    size: numberField({ required: true }),
    fileType: textField({ required: true }),
    url: textField({ required: true }),
    searchText: searchField(),
  },
  collaborators: {
    id: autoNumberField(),
    name: textField({ required: true }),
    emailAddress: textField({ required: true }),
    avatar: textField({ required: true }),
    // Collaborator lifecycle status. Expected values are ACTIVE or INACTIVE.
    status: textField({ required: true }),
    searchText: searchField(),
  },
  });

/** Generic type for plugin actions */
export type PluginActionType<I, O> = { input: I; result: O; };
export interface PluginTypesEmailReadConfigOutput {
  config: {
    smtp: {
      host: string;
      port: number;
      username: string;
      password: string;
      secure: boolean;
      from?: string;
    };
  } | null;
  hasEnvFallback: boolean;
}

export interface PluginTypesEmailUpdateConfigInput {
  config: {
    smtp: {
      host: string;
      port: number;
      username: string;
      password: string;
      secure: boolean;
      from?: string;
    };
  };
}

export interface PluginTypesEmailUpdateConfigOutput {
  success: true;
  config: {
    smtp: {
      host: string;
      port: number;
      username: string;
      password: string;
      secure: boolean;
      from?: string;
    };
  };
}

export interface PluginTypesEmailSendEmailInput {
  /**
   * @minItems 1
   */
  to: [string, ...string[]];
  cc?: string[];
  bcc?: string[];
  replyTo?: string[];
  from?: string;
  subject: string;
  body: {
    format: "text" | "html" | "markdown";
    content: string;
  };
}

export interface PluginTypesEmailSendEmailOutput {
  success: boolean;
  messageId: string;
}
export type TaylorDatabase = InferTaylorDatabase<typeof taylorSchema> & {
    _plugins: {
    'email': {
      /**
       * Reads saved email plugin configuration
       */
      'readConfig': PluginActionType<Record<string, any>, PluginTypesEmailReadConfigOutput>;
      /**
       * Replaces saved email plugin configuration
       */
      'updateConfig': PluginActionType<PluginTypesEmailUpdateConfigInput, PluginTypesEmailUpdateConfigOutput>;
      /**
       * Sends an email using saved plugin SMTP config or server fallback config
       */
      'sendEmail': PluginActionType<PluginTypesEmailSendEmailInput, PluginTypesEmailSendEmailOutput>;
    };
  };
  };
