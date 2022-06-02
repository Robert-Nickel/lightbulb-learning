<script>
	import API from '$lib/mailjet_api';
	function send() {
		API.sendMail(`{
		"Messages":[
            {
                "From": {
                    "Email": "mailjet@robertnickel.online",
                    "Name": "Me"
                },
                "To": [
                    {
                        "Email": "testing@robertnickel.online",
                        "Name": "You"
                    }
                ],
                "Subject": "My first Mailjet Email!",
                "TextPart": "Greetings from Mailjet!",
                "HTMLPart": "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
            }
		]
	}`);
	}
</script>

<button on:click={send}>Send Test Email</button>
