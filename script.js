// script.js

$(document).ready(function() {
    // Oletusteema on vaalea
    var darkThemeEnabled = false;

    // Funktio sään hakemiselle
    function fetchWeather() {
        var city = $('#cityInput').val();
        if (city !== '') {
            // Haetaan sää
            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/weather',
                data: {
                    q: city,
                    appid: 'b8d91fd13465591f048391ac5919109f',
                    units: 'metric'
                },
                method: 'GET',
                success: function(response) {
                    // Näytetään sää
                    $('#weatherContainer').slideUp(function() {
                        // Päivitetään säätiedot
                        $('#weatherDetails').html(`
                            <p><strong>City:</strong> ${response.name}, ${response.sys.country}</p>
                            <p><strong>Temperature:</strong> <span id="temperatureValue">${response.main.temp.toFixed()}</span>°C</p>
                            <p><strong>Weather:</strong> ${response.weather[0].description}</p>
                            <p><strong>Humidity:</strong> ${response.main.humidity}%</p>
                        `);

                        // Lisätään sääikoni
                        var iconCode = response.weather[0].icon;
                        var iconUrl = 'http://openweathermap.org/img/wn/' + iconCode + '.png';
                        var iconHtml = '<img src="' + iconUrl + '" style="display:none;">'; // Piilotetaan aluksi ikoni
                        $('#weatherDetails').append(iconHtml);

                        // Sääikoniin vilkkuva tehoste
                        var flashingInterval = setInterval(function() {
                            $('#weatherDetails img').fadeOut(200).fadeIn(200);
                        }, 300); // 200 millisekunnin välein vilkkuva tehoste

                        // Lopetetaan vilkkuva tehoste 2 sekunnin kuluttua
                        setTimeout(function() {
                            clearInterval(flashingInterval);
                        }, 1000); // 1 sekunnin kesto

                        $(this).slideDown();

                        // Päivitetään lämpötilan väri
                        updateTemperatureColor(response.main.temp.toFixed());
                    });
                },
                error: function() {
                    alert('Error fetching weather data.');
                }
            });
        } else {
            alert('Please enter a city name.');
        }
    }

    // Funktio lämpötilan värin päivittämiseksi sen arvon perusteella
    function updateTemperatureColor(value) {
        var temperatureElement = $('#temperatureValue');
        temperatureElement.removeClass('temperature-cold temperature-hot temperature-warm temperature-moderate temperature-zero'); // Poistetaan olemassa olevat väriluokat

        // Asetetaan uusi väri lämpötilan perusteella
        if (value < 0) {
            temperatureElement.addClass('temperature-cold'); // Vaaleansininen alle nollan
        } else if (value === 0) {
            temperatureElement.addClass('temperature-zero'); // Väri 0°C:lle
        } else if (value > 30) {
            temperatureElement.addClass('temperature-hot'); // Punainen yli 30°C:lle
        } else if (value >= 1 && value <= 19) {
            temperatureElement.addClass('temperature-moderate'); // Keltainen 1°C - 19°C:lle
        } else if (value >= 20) {
            temperatureElement.addClass('temperature-warm'); // Oranssi yli 20°C:lle
        }
    }

    // Sään hakeminen painamalla Enter-näppäintä
    $('#cityInput').keypress(function(event) {
        if (event.which === 13) {
            fetchWeather();
        }
    });

    // Sään hakeminen napilla
    $('#fetchWeatherBtn').click(fetchWeather);

    // Teeman vaihto
    $('#toggleThemeBtn').click(function() {
        // Vaihdetaan teema
        darkThemeEnabled = !darkThemeEnabled;
        if (darkThemeEnabled) {
            $('body').addClass('dark-theme').removeClass('light-theme');
        } else {
            $('body').addClass('light-theme').removeClass('dark-theme');
        }
    });
});
