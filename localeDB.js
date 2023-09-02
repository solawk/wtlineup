const en =
        {
            lineupSpan: "Lineup",
            searchSpan: "Search",
            switchLocale: "<img src='flags/britain.png' title='Переключить на русский'>",
            discord: "[Discord Bot]",
            discordInvite: "[Invite the bot]",
            creditsSpan: "by Solawk",
            nation: "Nation",
            cl: "Class",
            br: "BR",
            name: "Name",
            ussr: "USSR",
            germany: "Germany",
            usa: "USA",
            britain: "Great Britain",
            japan: "Japan",
            china: "China",
            italy: "Italy",
            france: "France",
            sweden: "Sweden",
            israel: "Israel",
            light: "Light tank",
            medium: "Medium tank",
            heavy: "Heavy tank",
            spg: "SPG",
            spaa: "SPAA",
            fighter: "Fighter",
            attacker: "Attacker",
            bomber: "Bomber",
            heli: "Helicopter",
            noneFound: "No matching vehicles",

            cancel: "Cancel",
            cancel2: "Cancel",
            creatingReport: "Creating a report",
            reportType: "Report type",
            addVehicle: "Add vehicle",
            editVehicle: "Edit vehicle",
            other: "Other",
            enName: "English name",
            ruName: "Russian name (leave empty if the same as the english name)",
            brReport: "Battle rating (sim, e.g. \"5.3\")",
            lineupsReport: "Lineups, divided with spaces (e.g. \"4_1 5_1\")",
            teamReport: "Team (pick a double team if it's both in a bottom and a top lineup)",
            axisReport: "Axis",
            alliesReport: "Allies",
            natoReport: "NATO",
            redsReport: "USSR+China",
            axisNatoReport: "Axis & Nato",
            alliesNatoReport: "Allies & NATO",
            alliesRedsReport: "Allies & USSR+China",
            infoReport: "Information",
            warning1: "The reports are processed manually.",
            warning2: "Please only send relevant reports on missing/incorrect vehicle information or application bugs.",
            sendReport: "Send report",

            availableLineups: "Available now",
            inLineup: "In",
            hLineup: "h",
            minLineup: "min",
            inLineup2: "in",
            dLineup2: "d",
            hLineup2: "h",
            minLineup2: "min",
            squadronReset: "Squadron activity reset",
            weekDay0: "Sun",
            weekDay1: "Mon",
            weekDay2: "Tue",
            weekDay3: "Wed",
            weekDay4: "Thu",
            weekDay5: "Fri",
            weekDay6: "Sat",

            whenNow: "Available now!",
            whenToday: "Available later today",
            whenTomorrow: "Available tomorrow",
            whenAfterTomorrow: "Available after tomorrow",
            whenAfterDaysBefore: "Available after ",
            whenAfterDaysAfter: " days",

            groundModeButton: "Ground SB",
            ecModeButton: "Air SB"
        };

const ru =
        {
            lineupSpan: "Сетап",
            searchSpan: "Поиск",
            switchLocale: "<img src='flags/russia.png' title='Switch to English'>",
            discord: "[Discord Бот]",
            discordInvite: "[Пригласить бота]",
            creditsSpan: "от Solawk",
            nation: "Нация",
            cl: "Класс",
            br: "БР",
            name: "Название",
            ussr: "СССР",
            germany: "Германия",
            usa: "США",
            britain: "Великобритания",
            japan: "Япония",
            china: "Китай",
            italy: "Италия",
            france: "Франция",
            sweden: "Швеция",
            israel: "Израиль",
            light: "Лёгкий танк",
            medium: "Средний танк",
            heavy: "Тяжёлый танк",
            spg: "САУ",
            spaa: "ЗСУ",
            fighter: "Истребитель",
            attacker: "Штурмовик",
            bomber: "Бомбардировщик",
            heli: "Вертолёт",
            noneFound: "Подходящей техники не найдено",

            cancel: "Отмена",
            cancel2: "Отмена",
            creatingReport: "Создание репорта",
            reportType: "Тип репорта",
            addVehicle: "Добавить технику",
            editVehicle: "Редактировать технику",
            other: "Другое",
            enName: "Название на английском",
            ruName: "Название на русском (оставьте пустым, если совпадает с английским)",
            brReport: "Боевой рейтинг (в СБ, например \"5.3\")",
            lineupsReport: "Сетапы, разделённые пробелом (например \"4_1 5_1\")",
            teamReport: "Команда (выберите двойную, если техника встречается в нижних и в верхних сетапах)",
            axisReport: "Ось",
            alliesReport: "Союзники",
            natoReport: "НАТО",
            redsReport: "СССР+Китай",
            axisNatoReport: "Ось & НАТО",
            alliesNatoReport: "Союзники & НАТО",
            alliesRedsReport: "Союзники & СССР+Китай",
            infoReport: "Информация",
            warning1: "Репорты обрабатываются вручную.",
            warning2: "Пожалуйста, отправляйте только актуальные сообщения о недостающей/некорректной информации о технике или о багах приложения.",
            sendReport: "Отправить репорт",

            availableLineups: "Доступны сейчас",
            inLineup: "Через",
            hLineup: "ч",
            minLineup: "мин",
            inLineup2: "через",
            dLineup2: "д",
            hLineup2: "ч",
            minLineup2: "мин",
            squadronReset: "Сброс полковой активности",
            weekDay0: "вс",
            weekDay1: "пн",
            weekDay2: "вт",
            weekDay3: "ср",
            weekDay4: "чт",
            weekDay5: "пт",
            weekDay6: "сб",

            whenNow: "Доступен сейчас!",
            whenToday: "Будет позже сегодня",
            whenTomorrow: "Будет завтра",
            whenAfterTomorrow: "Будет послезавтра",
            whenAfterDaysBefore: "Будет через ",
            whenAfterDaysAfter: " д",

            groundModeButton: "Совместные СБ",
            ecModeButton: "Воздушные СБ"
        };

let locale = localStorage.getItem("locale") ? localStorage.getItem("locale") : "en";