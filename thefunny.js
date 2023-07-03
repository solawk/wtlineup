const images =
    [
        "https://sostavproduktov.ru/sites/default/files/pictures/hleb/beliy/sorta.jpg",
        "https://sostavproduktov.ru/sites/default/files/styles/article_main/public/pictures/hleb/polza_chernogo_hlba.jpg",
        "https://sostavproduktov.ru/sites/default/files/styles/article_main/public/pictures/hleb/celnozwrnovoy_hleb.jpg",
        "https://sostavproduktov.ru/sites/default/files/styles/article_main/public/pictures/hleb/chem_polezen_kukuruzniy_hleb.jpg",
        "https://sostavproduktov.ru/sites/default/files/styles/article_main/public/pictures/hleb/kartofelniy_hleb.jpg",
        "https://sostavproduktov.ru/sites/default/files/styles/article_main/public/pictures/hleb/bezdrozzevoy_hleb.jpg",
        "https://sostavproduktov.ru/sites/default/files/styles/article_main/public/pictures/hleb/vipechka_iz_sdobnogo_testa.jpg",
        "https://sostavproduktov.ru/sites/default/files/styles/article_main/public/pictures/hleb/karavay_hleba.jpg",
        "https://tamarspb.ru/wp-content/uploads/2020/06/Armyanskii-lavash.jpg",
        "https://sostavproduktov.ru/sites/default/files/styles/article_main/public/pictures/hleb/shoty/shoty.jpg",
        "https://bbulvar.ru/upload/iblock/c17/c17eabb36099730e46ce65d222e768a6.jpg",
        "https://eli-shashlik.ru/wa-data/public/shop/products/28/00/28/images/31/31.970.jpg",
        "https://sostavproduktov.ru/sites/default/files/styles/article_main/public/pictures/hleb/pizza.jpg",
        "https://sostavproduktov.ru/sites/default/files/styles/article_main/public/pictures/hleb/italianskiy_hleb_chiabatta.jpg",
        "https://cheese-cake.ru/DesertImg/tortilya-pshenichnaya-8-dyujmov-0.jpg",
        "https://sostavproduktov.ru/sites/default/files/styles/article_main/public/pictures/hleb/lepeshki_chapati.jpg",
        "https://sostavproduktov.ru/sites/default/files/styles/article_main/public/pictures/hleb/indiyskaya_lepeshka_naan.jpg",
        "https://sostavproduktov.ru/sites/default/files/styles/article_main/public/pictures/hleb/beygl.jpg",
        "https://dpg.berlin/wp-content/uploads/2018/03/FOLAR_DA_PASCOA-1024x683.jpg",
        "https://sostavproduktov.ru/sites/default/files/pictures/hleb/pita/pita-gotovaya.jpg",
        "https://sostavproduktov.ru/sites/default/files/styles/article_main/public/pictures/hleb/brecel.jpg"
    ];

const names =
    [
        "белый хлеб",
        "ржаной (чёрный) хлеб",
        "цельнозерновой хлеб",
        "кукурузный хлеб",
        "картофельный хлеб",
        "бездрожжевой хлеб",
        "сдоба",
        "каравай",
        "лаваш",
        "шоти",
        "маца",
        "матнакаш",
        "пицца",
        "чиабатта",
        "тортилья",
        "чапати",
        "наан",
        "бейгл",
        "фолар",
        "пита",
        "брецель"
    ];

const descriptions =
    [
        "Цисгендерный и гетеросексуальный :saluting_face:",
        "Несмотря на то, что он составляет всего 13% от общего объёма... :cop:",
        "Самый древний, раньше считался низкосортным (прям как ты), а теперь считается элитным (не прям как ты) :face_with_monocle:",
        "На самом деле крутой, но в России такой встречается не часто. Имеет сладковатый привкус :eyes:",
        "На вкус нормально, иногда даже хорошо :potato:",
        "Полезнее, чем дрожжевой, но без дрожжей не выглядит таким же объёмным, размер имеет значение :pensive:",
        "Вах, сладкая моя булочка, какие у тебя пышные формы (никакого гейства, чисто мужской хлебс) :muscle:",
        "Дарую вам древнерусское поедание каравая :sunny:",
        "Шаверма в тебе хорошо уместится, слющай (шаурма-фаны сасат) :scroll:",
        "Шоти смотришь, грузинский хлеб? Верхний Ларс чекай :red_car:",
        "Ябпомацал. Не воюет со своими соседями, проверяй :synagogue:",
        "Математический накашлял, или как это иначе расшифровать :thinking:",
        "Лепёшка для пиццы считается отдельным видом хлеба, да. Тобой может насладиться целая компания, по кругу :pizza:",
        "Большая пористость и твёрдая корочка. Внутрь при приготовлении закладываются белые жидкости (молоко и сливки) :milk:",
        "Как это ни парадоксально, не используется для создания тортов по имени Илья :turtle:",
        "Просто лепёшки, до такой степени простые и индийские, что их взяли на фрилансе рисовать модельки для флота :ship:",
        "Торт с кофе — не фокстрот. Дарили б еду — дебил и рад. Я уж рублями мял буржуя. :left_right_arrow:",
        "А мне заварной амэриканский бублик дороже родины :doughnut:",
        "Даже у этого французского каравая есть яйца, а ты всё ещё не можешь подкатить к Ленке из соседнего класса :egg:",
        "Пресная арабская лепёшка, пустая внутри. Но всё впереди, всё наладится :pleading_face:",
        "Пивная закуска к сетапу из Турмса и Деривации :beers:",
    ];

function hash(str)
{
    let value = 0;

    for (let i = 0; i < str.length; i++)
    {
        value += str.charCodeAt(i);
    }

    return value % names.length;
}

module.exports =
    {
        theFunnyImages: images,
        theFunnyNames: names,
        theFunnyDescriptions: descriptions,
        theFunnyHashing: hash
    }