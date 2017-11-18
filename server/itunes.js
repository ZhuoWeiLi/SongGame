const TOP_SONGS_URL_BASE = "https://rss.itunes.apple.com/api/v1/"
const TOP_SONGS_URL_END = "/itunes-music/hot-tracks/all/100/explicit.json"
const ITUNES_BASE = "https://itunes.apple.com/lookup?id="
const request = require('request')
const _ = require('underscore');


function getTopSongs(region) {
    return new Promise((resolve, reject) => {
        request(TOP_SONGS_URL_BASE + region + TOP_SONGS_URL_END, (error, success, data) => {
            if (error) {
                reject(error)
            }
            else {
                let results = JSON.parse(data).feed.results
                resolve({ region: region, results: results })
            }

        })
    })
}

function getSongInfo(id, region) {
    return new Promise((resolve, reject) => {
        request(`${ITUNES_BASE}${id}&country=${region}`, (error, success, data) => {
            if (error) {
                reject(error)
            }
            else {
                let results = JSON.parse(data).results
                resolve({ title: results[0].trackName, source: results[0].previewUrl, region: region })
            }
        })
    })

}

function populateSongs() {
    const songsByCountry = {
        "ca": [],
        "jp": [],
        "us": []
    }

    var country_count = 0
    return new Promise((resolve) => {
        for (key in songsByCountry) {

            getTopSongs(key).then((data) => {
                const country = data.region

                country_count += 1

                songsByCountry[country] = data.results.map((entry) => {
                    return getSongInfo(Number(entry.id), country)
                })

                _.shuffle(songsByCountry[country])

                if (country_count >= Object.values(songsByCountry).length) {
                    Promise.all(Object.values(songsByCountry).map((country) => {
                        return Promise.all(country)
                    })).then((data) => {
                        for (i=0; i< data.length; i++) {
                            songsByCountry[data[i][0].region] = data[i]
                        }
                        resolve(songsByCountry)
                    })
                }
            })
        }
    })
}

module.exports = populateSongs



