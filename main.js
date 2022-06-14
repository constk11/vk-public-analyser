import 'https://code.jquery.com/jquery-3.3.1.min.js'

const ACCESS_TOKEN = '32b920aecb767db1db87d2c7c010c9dd171cb9e56e7fa34391f47d97f25cb57c280ff53e9c2f4b940df87'

function getPosts(groupId, groupName) {
    const keywords = [
        'российские энергоносители',
        'европа газ',
        'европа нефть',
        'европа уголь',
    ]
    const newsObj = []
    keywords.forEach((query) => {
        $.getJSON({
            url: `https://api.vk.com/method/wall.search?access_token=${ACCESS_TOKEN}&owner_id=-${groupId}&owners_only=1&query=${query}&count=100&v=5.131`,
            jsonp: 'callback',
            dataType: 'jsonp',
        }).done(function (data) {
            data.response.items.map((news) => {
                const newsFields = {}
                newsFields.date = new Date(
                    +news.date * 1000
                ).toLocaleDateString('ru-RU')
                newsFields.text = news.text
                newsFields.url =
                    'https://vk.com/wall-' + groupId + '_' + news.id
                if (
                    newsFields.date.toString().includes('05.2022') ||
                    newsFields.date.toString().includes('04.2022') ||
                    newsFields.date.toString().includes('03.2022')
                ) {
                    newsObj.push(newsFields)
                }
            })
        })
    })

    setTimeout(() => {
        download(groupName + '.json', JSON.stringify(Object.assign({}, newsObj)))
    }, 5000)
}

function download(filename, text) {
    var element = document.createElement('a')
    element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
    )
    element.setAttribute('download', filename)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
}

function main() {
    const groups = [
        {'tass': '26284064'},
        {'russia 24': '62623421'},
        {'vesti': '24136539'},
        {'ria news': '15755094'},
        {'izvestiya': '27532693'},
        {'vedomosti': '15548215'},
        {'rbk': '25232578'},
        {'kommersant': '23482909'},
        {'antiMaydan': '41232698'},
        {'kp': '15722194'},
        {'lentach': '29534144'}
    ]
    let i = 0;

    groups.forEach(group => {
        i += 2
        setTimeout(() => {
            getPosts(group[Object.keys(group)], Object.keys(group))
        }, i * 1000);
    })
}

main()
