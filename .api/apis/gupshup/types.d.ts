import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';
export type SendingTextTemplateFormDataParam = FromSchema<typeof schemas.SendingTextTemplate.formData>;
export type SendingTextTemplateMetadataParam = FromSchema<typeof schemas.SendingTextTemplate.metadata>;
export type SendingTextTemplateResponse202 = FromSchema<typeof schemas.SendingTextTemplate.response['202']>;
export type SendingTextTemplateResponse400 = FromSchema<typeof schemas.SendingTextTemplate.response['400']>;
export type SendingTextTemplateResponse401 = FromSchema<typeof schemas.SendingTextTemplate.response['401']>;
