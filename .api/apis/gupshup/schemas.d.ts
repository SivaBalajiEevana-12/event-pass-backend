declare const SendingTextTemplate: {
    readonly formData: {
        readonly type: "object";
        readonly required: readonly ["source", "destination", "template"];
        readonly properties: {
            readonly source: {
                readonly type: "string";
                readonly description: "Sender Whatsapp Number";
                readonly examples: readonly ["919163xxxxx3"];
            };
            readonly "src.name": {
                readonly type: "string";
                readonly description: "App name that the source number belongs to";
                readonly examples: readonly ["DemoApp"];
            };
            readonly destination: {
                readonly type: "string";
                readonly description: "Receiver Whatsapp Number";
                readonly examples: readonly ["917839xxxxx3"];
            };
            readonly template: {
                readonly type: "object";
                readonly description: "contains template id and list of template parameters";
                readonly properties: {
                    readonly id: {
                        readonly type: "string";
                        readonly description: "Template ID";
                        readonly examples: readonly ["template_id"];
                    };
                    readonly params: {
                        readonly type: "array";
                        readonly description: "List of template parameters";
                        readonly items: {
                            readonly type: "string";
                        };
                        readonly examples: readonly ["hi"];
                    };
                };
            };
            readonly postbackTexts: {
                readonly type: "array";
                readonly description: "list of objects containing postback text details; include if postback text support required for quick-reply buttons";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly index: {
                            readonly type: "integer";
                            readonly description: "button index (0-based)";
                            readonly examples: readonly [0];
                        };
                        readonly text: {
                            readonly type: "string";
                            readonly description: "postback text for the button";
                            readonly examples: readonly ["hello"];
                        };
                    };
                };
            };
            readonly channel: {
                readonly type: "string";
                readonly description: "Messaging Platform Name";
                readonly examples: readonly ["whatsapp"];
            };
        };
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly apikey: {
                    readonly type: "string";
                    readonly examples: readonly ["2xxc4x4xx2c94xxxc2f9xx9d43xxxx8a"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Your account API key";
                };
            };
            readonly required: readonly ["apikey"];
        }];
    };
    readonly response: {
        readonly "202": {
            readonly type: "object";
            readonly properties: {
                readonly messageId: {
                    readonly type: "string";
                    readonly description: "message id for the template message sent";
                    readonly examples: readonly ["message id"];
                };
                readonly status: {
                    readonly type: "string";
                    readonly description: "Status of the response\n\n`success`";
                    readonly enum: readonly ["success"];
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                    readonly description: "error message";
                    readonly examples: readonly ["Invalid Destination"];
                };
                readonly status: {
                    readonly type: "string";
                    readonly description: "Status of the response\n\n`error`";
                    readonly enum: readonly ["error"];
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                    readonly description: "error message";
                    readonly examples: readonly ["Authentication Failed"];
                };
                readonly status: {
                    readonly type: "string";
                    readonly description: "Status of the response\n\n`error`";
                    readonly enum: readonly ["error"];
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
export { SendingTextTemplate };
