import 'https://code.jquery.com/jquery-3.3.1.min.js'
import { ACCESS_TOKEN } from './credentials'

function getPosts(groupId, groupName) {
    const keywords = [
        'паспорт болельщика',
        'fan id',
    ]
    const newsObj = [];
    const dateRange = [];
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
                ).toLocaleDateString('ru-RU');
                newsFields.text = news.text;
                newsFields.url =
                    'https://vk.com/wall-' + groupId + '_' + news.id;
                if (
                    newsFields.date.toString().includes('07.2022') ||
                    newsFields.date.toString().includes('08.2022') ||
                    newsFields.date.toString().includes('09.2022') ||
                    newsFields.date.toString().includes('10.2022') ||
                    newsFields.date.toString().includes('11.2022') ||
                    newsFields.date.toString().includes('12.2022') ||
                    newsFields.date.toString().includes('01.2023') ||
                    newsFields.date.toString().includes('02.2023')
                ) {
                    dateRange.push(newsFields.date.substr(-7))
                    newsObj.push(newsFields)
                }

            })
        })
    },
        )

    setTimeout(() => {
        newsObj.push({frequency: calcMaxDateRange(dateRange)})
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

function calcMaxDateRange(news) {
    if (!news) {return}
    return news.sort((a,b) => 
        news.filter(v => v===a).length - news.filter(v => v===b).length
    ).pop();
}

function main() {
    const groups = [
        {'izvestiya': '27532693'},
        {'vedomosti': '15548215'},
        {'rbk': '25232578'},
        {'kommersant': '23482909'},
        {'Футбол | Чемпионат Мира 2022': '28639294'},
        {'Российский Футбол: РПЛ': '25505197'},
    ]
    let i = 0;

    groups.forEach(group => {
        i += 5
        setTimeout(() => {
            getPosts(group[Object.keys(group)], Object.keys(group))
        }, i * 1000);
    })
}

main()
