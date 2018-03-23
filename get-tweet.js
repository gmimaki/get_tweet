const twitter = require('twitter');
const mailer = require('nodemailer');

/*取得したTwittterAPIアカウント情報を記載*/
const client = new twitter({
    consumer_key: 'XXXXXXXXXXXXXXX',
    consumer_secret: 'YYYYYYYYYYYYYYYYYYY',
    access_token_key: 'XXXXXXXXXXXXXXXXXXXXXX',
    access_token_secret: 'YYYYYYYYYYYYYYYYYYYYYYYY'
});

/*ツイート検索のパラメーター。
qは検索文字列、countは表示するツイート数、
result_typeは、有名なツイート(リツイート数やファボ数が多いツイートと思われる)popular、
最新のツイートを取得するrecent、popularやrecentを混ぜたmixedなどから選べるよう。
今回はノイズを防ぐためpopularを選択*/
const params = {
    q: process.argv[2],
    count: 50,
    result_type: 'popular'
};

const mailSettings = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    use_authentication: true,
    auth: {
        user: 'AAAAAAAAAAAA@gmail.com', /*自分のgmailアカウント*/
        pass: 'BBBBBBBBBBBB'
    }
};

function sendMail(conf, title, text) {
    const transporter = mailer.createTransport(conf);
    const mailOptions = {
        /*toにmailSettingで指定したアカウントを指定すると、自分のアカウントで自分にメールを送ることになるので、
        セキュリティ的に色々やらないといけない面倒なことを省ける*/
        from: 'AAAAAAAAAAAAAAAAA@gmail.com',
        to: 'BBBBBBBBBBBBBb@gmail.com',
        subject: title,
        html: text
    };

    transporter.sendMail(mailOptions, function(err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log('sent');
        }
        transporter.close();
    });
}

/*ツイートを取得、メール送信*/
function main(params, mailSettings) {
    client.get('search/tweets', params, function(err, tweets, res) {
        if (err) {
            console.log(err);
        } else {
            const title = tweets['statuses'][0]['text'];
            let text = '';
            for (let tweet of tweets['statuses']) {
                text += '<p>' + tweet['user']['name'] + '</p>' + '\n';
                text += '<p>' + tweet['text'] + '</p>' + '\n';
                text += '<small>' + '( ' + tweet['created_at'] + ' )' + '</small>' + '\n\n';
            }
            sendMail(mailSettings, title, text);
        }
    });
};

setInterval(function() {
    main(params, mailSettings);
}, 3600000)
「開票速報」でツイートを検索する。
