const { App } = require("@slack/bolt");

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// ref. https://slack.dev/bolt-js/ja-jp/concepts#shortcuts
// callback_id が 'hello' と一致し type が 'message_action' と一致する場合のみミドルウェアが呼び出される
app.shortcut(
  { callback_id: "hello", type: "message_action" },
  async ({ shortcut, ack, context, client, payload }) => {
    try {
      // ショートカットリクエストの確認
      await ack();

      console.log(payload.message.text);

      // 組み込みの WebClient を使って views.open API メソッドを呼び出す
      const result = await app.client.views.open({
        // `context` オブジェクトに保持されたトークンを使用
        token: context.botToken,
        trigger_id: shortcut.trigger_id,
        view: {
          type: "modal",
          title: {
            type: "plain_text",
            text: "My App",
          },
          close: {
            type: "plain_text",
            text: "Close",
          },
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text:
                  "About the simplest modal you could conceive of :smile:\n\nMaybe <https://api.slack.com/reference/block-kit/interactive-components|*make the modal interactive*> or <https://api.slack.com/surfaces/modals/using#modifying|*learn more advanced modal use cases*>.",
              },
            },
            {
              type: "context",
              elements: [
                {
                  type: "mrkdwn",
                  text:
                    "Psssst this modal was designed using <https://api.slack.com/tools/block-kit-builder|*Block Kit Builder*>",
                },
              ],
            },
          ],
        },
      });

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
);

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
