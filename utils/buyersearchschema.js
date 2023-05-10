var schem =
{
    "flat": {
        "schema": {
            "$schema": "http://json-schema.org/draft-03/schema#",
            "type": "object",
            "properties": {
                "maininfo": {
                    "type": "object",
                    "title": "Основная информация",
                    "format": "hidden",
                    "properties": {
                        /*"inital": {
                         "type": "string",
                         "title": "Нач. свед.",
                         "description": "Начальные сведения, \nBoshlang'ich ma'lumotlar",
                         "format": "text"
                         },
                         "msgstatus": {
                         "type": "string",
                         "title": "Статус",
                         "enum": [
                         "продан",
                         "не продан",
                         "временно остановлен",
                         "сдан",
                         "не сдан",
                         "тел откл. вне зоны",
                         "тел не ответил",
                         "неправильный номер"
                         ]
                         },
                         "importance": {
                         "type": "string",
                         "title": "Важность",
                         "enum": [
                         "1-степень",
                         "2-степень",
                         "3-степень"
                         ]
                         },

                         "isbuyer": {
                         "type": "string",
                         "title": "Хочет купить?",
                         "description": "Хочет купить?",
                         "enum": [
                         "да",
                         "нет"
                         ]
                         },*/
                        "retype": {
                            "type": "string",
                            "title": "Тип недвиж.",
                            "description": "Тип недвижимости",
                            "enum": [
                                "Квартиры",
                                "Дома",
                                "Земля",
                                "Гаражи / стоянки",
                                "Коммерческие помещения"
                            ]
                        },
                        "dealtype": {
                            "type": "string",
                            "title": "Тип сделки",
                            "description": "Тип сделки",
                            "enum": [
                                "Аренда",
                                "Аренда долгосрочная",
                                "Аренда посуточно",
                                "Продажа",
                                "Обмен"
                            ]
                        },
                        "markettype": {
                            "type": "string",
                            "title": "Тип рынка",
                            "description": "Тип рынка недвижимости",
                            "enum": [
                                "Вторичный рынок",
                                "Новостройки"
                            ]
                        },
                        "address": {
                            "type": "object",
                            "title": "Адрес",
                            "c": "c",
                            "description": "Месторасположение(Зона, район, квартал, массив, улица, дом №, кв.№, подъезд №)",
                            "properties": {

                                "city": {
                                    "type": "string",
                                    "title": "город",
                                    "enum": ["Ташкент"
                                        /*, "Аккурган", "Акташ", "Алмалык", "Ангрен", "Андижан", "Асака", "Ахангаран", "Ахунбабаев", "Байсун", "Бахт", "Баяут", "Бекабад", "Беруни", "Бешарык", "Большой Чимган", "Булунгур", "Бустан", "Бухара", "Бухара", "Вабкент", "Газалкент", "Газли", "Галаасия", "Галлаарал", "Гиждуван", "Гулистан", "Гульбахор", "Гурлен", "Дангара", "Денау", "Джамбай", "Джизак", "Джума", "Дурмень", "Дустабад", "Дустлик", "Заамин", "Зангиата", "Зарафшан", "Зиадин", "Искандар", "Каган", "Камаши", "Канимех", "Канлыкуль", "Каракуль", "Карасу", "Караузяк", "Караул", "Кармана", "Карши", "Касби", "Каттакурган", "Келес", "Кибрай", "Китаб", "Коканд", "Коксарай", "Кошкупыр", "Красногорск", "Кувасай", "Кунград", "Кушрабад", "Кызылтепа", "Лаиш", "Мангит", "Маргилан", "Мирабад", "Музрабад", "Навои", "Назарбек", "Наманган", "Нукус", "Нурабад", "Нурата", "Нурафшан (Тойтепа)", "Пап", "Паркент", "Питнак", "Пскент", "Риштан", "Ромитан", "Салар", "Самарканд", "Сырдарья", "Тахиаташ", "Ташлак", "Ташморе", "Термез", "Туракурган", "Турткуль", "Ургенч", "Ургут", "Уртааул", "Учкудук", "Учкурган", "Фергана", "Хаваст", "Хазарасп", "Ханка", "Хива", "Ходжаабад", "Ходжейли", "Ходжикент", "Чарвак", "Чилек", "Чимбай", "Чиназ", "Чиракчи", "Чирчик", "Шават", "Шаргунь", "Шафиркан", "Шахрисабз", "Ширин", "Эшангузар", "Яккабаг", "Янгиарык", "Янгибазар", "Янгикишлак", "Янгирабат", "Янгиюль"*/
                                    ]
                                },
                                /*"region": {
                                 "type": "string",
                                 "title": "область",
                                 "enum": [
                                 "Ташкентская область",
                                 "Кашкадарьинская область",
                                 "Бухарская область",
                                 "Самаркандская область",
                                 "Ферганская область",
                                 "Хорезмская область",
                                 "Каракалпакстан",
                                 "Сурхандарьинская область",
                                 "Андижанская область",
                                 "Джизакская область",
                                 "Навоийская область",
                                 "Наманганская область",
                                 "Сырдарьинская область"
                                 ]
                                 },*/
                                "district": {
                                    "type": "string",
                                    "title": "район",
                                    "enum": [
                                        "Алмазарский район",
                                        "Бектемирский район",
                                        "Мирабадский район",
                                        "Мирзо-Улугбекский район",
                                        "Сергелийский район",
                                        "Учтепинский район",
                                        "Чиланзарский район",
                                        "Шайхантахурский район",
                                        "Юнусабадский район",
                                        "Яшнабадский район",
                                        "Яккасарайский район"
                                    ]
                                },
                                "section": {
                                    "type": "string",
                                    "title": "квартал"
                                },
                                /* "block": {
                                 "type": "string",
                                 "title": "массив"
                                 },
                                 "street": {
                                 "type": "string",
                                 "title": "улица"
                                 },
                                 "house": {
                                 "type": "string",
                                 "title": "дом №"
                                 },
                                 "apartment": {
                                 "type": "integer",
                                 "title": "кв.№"
                                 },
                                 "porch": {
                                 "type": "integer",
                                 "title": "подъезд №"
                                 },
                                 "doorcode": {
                                 "type": "string",
                                 "title": "код двери"
                                 },
                                 "zone": {
                                 "type": "integer",
                                 "title": "Зона"
                                 },
                                 "geodata": {
                                 "type": "string",
                                 "title": "Геоданные"
                                 },
                                 "geolocation": {
                                 "type": "object",
                                 "title": "Геопозиция",
                                 "properties": {
                                 "": {
                                 "type": "string",
                                 "title": "",
                                 "format": "getgeopos"
                                 },
                                 "lat": {
                                 "type": "number",
                                 "title": "Lat"
                                 },
                                 "lon": {
                                 "type": "number",
                                 "title": "Lon"
                                 },
                                 "acc": {
                                 "type": "number",
                                 "title": "Acc"
                                 }
                                 }
                                 }*/
                            }
                        },
                        /* "landmark": {
                         "title": "Ориентиры",
                         "type": "string",
                         "format": "text"
                         },
                         "ownertel": {
                         "type": "array",
                         "title": "Телефон",
                         //"c": "c",
                         "description": "Телефон владельца",
                         //"readOnly": true,
                         "items": {
                         "type": "string",
                         "format": "tel",
                         "description": "Телефон владельца",
                         //"readOnly": true,
                         }
                         },*/

                        "rooms": {
                            "type": "array",
                            "title": "К",
                            "description": "Количество комнат",
                            "items": {
                                "type": "integer",
                                "title": "комнаты"
                            }
                        },
                        "floor": {
                            "type": "integer",
                            "title": "Э",
                            "description": "Этаж"
                        },
                        "storeys": {
                            "title": "В",
                            "description": "Высотность, скольки этажное здание",
                            "type": "integer"
                        },
                        "ownerdatafull": {
                            "title": "Заказчики",
                            "description": "Группа заказчиков",
                            "type": "array",
                            "items": {
                                "type": "object",

                                "properties": {
                                    "role": {
                                        "title": "Роль",
                                        "type": "string",
                                        "enum": [
                                            "собственник",
                                            "агентсвто",
                                            "риелтор",
                                            "маклер",
                                            "домком",
                                            "посредник",
                                            "вторичный рынок",
                                            "частное лицо",
                                            "другой"
                                        ]
                                    },
                                    "sellerdata": {
                                        "type": "object",
                                        "title": "Инф",
                                        "description": "информация о заказчике",
                                        "properties": {
                                            "sellername": {
                                                "title": "Имя",
                                                "description": "Ф.И.О заказчика (как обращаться)",
                                                "type": "string"
                                            },
                                            "sellertel": {
                                                "type": "array",
                                                "title": "Тел",
                                                "description": "Телефон заказчика",
                                                "items": {
                                                    "type": "string",
                                                    "format": "tel",
                                                    "description": "Телефон заказчика"
                                                }
                                            }
                                        }


                                    }

                                }
                            }
                        },
                        /*"ownerdata": {
                         "title": "Ф.И.О",
                         "description": "Ф.И.О владельца (как обращаться)",
                         "type": "string"
                         },
                         "area": {
                         "title": "Кв.м.",
                         "description": "Общая площадь, кв.м.",
                         "type": "number"
                         },
                         "area100": {
                         "title": "Сотки",
                         "description": "Общая площадь, сотки",
                         "type": "number"
                         },
                         "propertytype": {
                         "type": "string",
                         "title": "Тип",
                         "description": "Тип недвижимости",
                         "enum": [
                         "квартира",
                         "частный дом",
                         "дача",
                         "коммерческая недвижимость",
                         "земельные участки"
                         ]
                         },*/
                        "pricestart": {
                            "type": "integer",
                            "title": "Стартовая цена",
                            //"default": "0",
                            "description": "Стартовая цена"
                        },
                        "priceend": {
                            "type": "integer",
                            "title": "Оконч. цена",
                            //"default": "0",
                            "description": "Окончательная цена"
                        },
                        "currency": {
                            "type": "string",
                            "title": "Валюта",
                            "enum": [
                                "сум",
                                "у.е."
                            ]
                        },
                        /*"pricehistory": {
                         "type": "array",
                         "title": "История цен",
                         "items": {
                         "type": "object",
                         "properties": {
                         "date": {
                         "type": "string",
                         "title": "Дата",
                         "format": "date"
                         },
                         "prc": {
                         "type": "integer",
                         "title": "Цена"
                         },
                         "cause": {
                         "type": "string",
                         "title": "Причина"
                         }
                         }
                         }
                         },
                         "flooradditional": {
                         "type": "array",
                         "title": "Доп. этажи",
                         "description": "Дополнительные этажи",
                         "items": {
                         "type": "string",
                         "title": "Дополнительный этаж",
                         "enum": [
                         "мансарда",
                         "чердак",
                         "подвал -1",
                         "подвал -2",
                         "полуподвал"
                         ]
                         }
                         },
                         "layout": {
                         "title": "Планировка",
                         "type": "string",
                         "enum": [
                         "французская",
                         "улучшенная",
                         "ташкентская",
                         "московская",
                         "77-серия кирпич",
                         "украинская",
                         "японская",
                         "сталинская",
                         "галерейный тип",
                         "спецплан",
                         "банковская",
                         "другая"
                         ]
                         },
                         "yearofconstruction": {
                         "title": "Год",
                         "description": "Год постройки дома",
                         "type": "string"
                         },
                         "material": {
                         "title": "Материал",
                         "description": "Материал дома",
                         "type": "string",
                         "enum": [
                         "Кирпичный",
                         "панель",
                         "керамзит-бетон",
                         "дерево",
                         "блочный",
                         "другой"
                         ]
                         },
                         "location": {
                         "title": "М-положение",
                         "description": "Местоположение дома",
                         "type": "string",
                         "enum": [
                         "вдоль дороги",
                         "2-й дом от дороги",
                         "в глубине кваратала"
                         ]
                         },
                         "roomslayout": {
                         "title": "Комнаты",
                         "type": "string",
                         "enum": [
                         "раздельные",
                         "смежные",
                         "зеркальные"
                         ]
                         },
                         "smell": {
                         "title": "Запахи",
                         "description": "Посторонние запахи",
                         "type": "array",
                         "items": {
                         "type": "string",
                         "enum": [
                         "аромалампы",
                         "свечи с ароматами лаванды",
                         "диффузоры - стеклянная емкость с ароматной жидкостью",
                         "спреи и автоматические диспенсеры",
                         "эссенции",
                         "благовония",
                         "саше и попурри",
                         "интерьерные духи",
                         "нейтрализаторы",
                         "мусор",
                         "пот",
                         "алкоголь",
                         "моча",
                         "химические",
                         "пища",
                         "прочие",
                         "кондитерский",
                         "масло",
                         "пивоваренный"
                         ]
                         }
                         },
                         "ceilingheight": {
                         "title": "Выс. потолков",
                         "type": "number",
                         "enum": [
                         2.5,
                         2.7,
                         2.8,
                         3.0,
                         3.2,
                         3.6,
                         4.0,
                         4.5,
                         5.0,
                         6.0
                         ]
                         },
                         "butt": {
                         "title": "Торец",
                         "type": "string",
                         "enum": [
                         "да",
                         "нет"
                         ]
                         },
                         "bathroom": {
                         "title": "Санузел",
                         "type": "string",
                         "enum": [
                         "раздельный",
                         "совмещенный",
                         "2 санузла"
                         ]
                         },
                         "balcony": {
                         "title": "Балкон",
                         "type": "string",
                         "enum": [
                         "2х6",
                         "1.5х6",
                         "2х3",
                         "1х7",
                         "2.5х6.2",
                         "2х7",
                         "2х8",
                         "другой"
                         ]
                         },
                         "visittime": {
                         "type": "object",
                         "title": "Время",
                         "description": "Время осмотра",
                         "properties": {
                         "start": {
                         "type": "string",
                         "format": "date",
                         "title": "с"
                         },
                         "end": {
                         "type": "string",
                         "format": "date",
                         "title": "до"
                         }
                         }
                         },
                         "infoorigin": {
                         "type": "string",
                         "title": "Инф. от",
                         "description": "Источник информации",
                         "enum": [
                         "газета",
                         "olx.uz",
                         "uybor.uz",
                         "internet",
                         "другая"
                         ]
                         },
                         "remarks": {
                         "title": "Примечание",
                         "type": "string",
                         "format": "text"
                         },
                         "date": {
                         "title": "Дата",
                         "type": "string",
                         "format": "date"
                         },
                         "securitysystem": {
                         "title": "Охр. система",
                         "description": "Наличие охранной системы",
                         "type": "string",
                         "enum": [
                         "сигнализация",
                         "решетки на окнах",
                         "кодовая дверь",
                         "видеодомофон",
                         "камеры наблюдения",
                         "датчики движения"
                         ]
                         },
                         "roof": {
                         "title": "Крыша",
                         "type": "string",
                         "enum": [
                         "одинарная",
                         "двойная",
                         "чердачная"
                         ]
                         },
                         "roofcondition": {
                         "title": "Сост. крышы",
                         "description": "Состояние крышы",
                         "type": "string",
                         "enum": [
                         "течет",
                         "не течет"
                         ]
                         },
                         "roofmaterial": {
                         "title": "Мат. крышы",
                         "description": "Материал крышы",
                         "type": "string",
                         "enum": [
                         "рубероид",
                         "профнастил",
                         "шифер",
                         "полизол",
                         "фольгизол",
                         "другой"
                         ]
                         },
                         "infrastructure": {
                         "title": "Инф-ра",
                         "description": "Инфраструктура",
                         "type": "array",
                         "items": {
                         "type": "string",
                         "enum": [
                         "школа",
                         "детсад",
                         "аптека",
                         "больница",
                         "поликлиника",
                         "супермаркет",
                         "магазин",
                         "базар-рынок",
                         "другие",


                         "Больница",
                         "Детская площадка",
                         "Детский сад",
                         "Остановки",
                         "Парк",
                         "зелёная зона",
                         "Развлекательные заведения",
                         "Рестораны",
                         "кафе"
                         ]
                         }
                         },
                         "subway": {
                         "title": "Наличие метро",
                         "type": "string",
                         "enum": [
                         "да",
                         "нет"
                         ]
                         },
                         "subwaytitle": {
                         "title": "Название метро",
                         "type": "string"
                         },
                         "subwaydistance": {
                         "title": "Рас. до метро",
                         "description": "Сколько метров до метро",
                         "type": "integer"
                         },
                         "parking": {
                         "title": "Парковка",
                         "description": "Парковочные места",
                         "type": "string",
                         "enum": [
                         "гараж",
                         "стоянка",
                         "своя парковка"
                         ]
                         },
                         "porch": {
                         "title": "Подъезд",
                         "type": "string",
                         "enum": [
                         "ремонтирован",
                         "не ремонтирован"
                         ]
                         },
                         "garden": {
                         "title": "Огород",
                         "type": "string",
                         "enum": [
                         "есть",
                         "нет"
                         ]
                         },
                         "lift": {
                         "title": "Лифт",
                         "type": "string",
                         "enum": [
                         "есть",
                         "нет"
                         ]
                         },
                         "liftcondition": {
                         "title": "Сост. лифта",
                         "description": "Состояние лифта",
                         "type": "string",
                         "enum": [
                         "работает",
                         "не работает"
                         ]
                         },
                         "neighbors": {
                         "title": "Соседи",
                         "type": "array",
                         "items": {
                         "type": "string",
                         "enum": [
                         "узбекоязычные",
                         "европейцы",
                         "иностранцы",
                         "спокойные",
                         "шумные",
                         "пенсионеры",
                         "молодая семья",
                         "квартиранты",
                         "алкоголики",
                         "неприличные",
                         "непуты"
                         ]
                         }
                         },
                         "famousneighbors": {
                         "title": "Знам. соседи",
                         "description": "Знаменитые соседи",
                         "type": "array",
                         "items": {
                         "type": "string",
                         "enum": [
                         "правительственные чиновники",
                         "религиозные деятели",
                         "ученые",
                         "спортсмены",
                         "представители шоу-бизнеса",
                         "блогеры",
                         "публичные личности",
                         "представители мафии"
                         ]
                         }
                         }*/
                    }
                }
                /*,
                 "ownerpersonalinformation": {
                 "type": "object",
                 "title": "Личные данные владельца",
                 "format": "hidden",
                 "properties": {
                 "coownerdata": {
                 "type": "string",
                 "title": "Ф.И.О совлад.",
                 "description": "Ф.И.О совладельцев (как обращаться)"
                 },
                 "coownertel": {
                 "type": "array",
                 "title": "Тел. совлад.",
                 "description": "Телефон совладельцев",
                 "items": {
                 "type": "string",
                 "format": "tel",
                 "description": "Телефон совладельцев"
                 }
                 },
                 "contactpersondata": {
                 "type": "string",
                 "title": "Ф.И.О к. лица",
                 "description": "Ф.И.О контактного лица (как обращаться)"
                 },
                 "contactpersontel": {
                 "type": "array",
                 "title": "Тел. конт. лица",
                 "description": "Телефон контактного лица",
                 "items": {
                 "type": "string",
                 "format": "tel",
                 "description": "Телефон контактного лица"
                 }
                 },
                 "formsofpayment": {
                 "title": "Ф. оплаты",
                 "description": "Формы оплаты",
                 "description": "Возможные формы оплаты",
                 "type": "string",
                 "enum": [
                 "наличные",
                 "перечислением",
                 "ипотека",
                 "рассрочка",
                 "другое"
                 ]
                 },
                 "decisionwho": {
                 "title": "Приним. реш.",
                 "description": "Кто принимает решение о продаже квартиры и об окончательной цене?",
                 "type": "string"
                 },
                 "matching": {
                 "title": "Согл. с род.",
                 "description": "Согласование с родными и близкими",
                 "type": "string",
                 "enum": [
                 "устное",
                 "письменное",
                 "нотариально заверенное"
                 ]
                 },
                 "placeofresidence": {
                 "title": "М. факт. прож.",
                 "description": "Место фактического проживания",
                 "type": "string"
                 },
                 "liveinthis": {
                 "title": "Живут ли?",
                 "description": "Живут ли в данной квартире? Если да, то кто живет?",
                 "type": "string"
                 },
                 "additionalrealestate": {
                 "title": "Налич. доп. недв.",
                 "description": "Наличие дополнительной продаваемой недвижимости",
                 "type": "string",
                 "enum": [
                 "да",
                 "нет"
                 ]
                 },
                 "vacateaftersale": {
                 "title": "В теч. скол.",
                 "description": "В течение скольких дней освободит недвижимость после продажи",
                 "type": "string"
                 },
                 "numberofregistered": {
                 "title": "Кол. проп.",
                 "description": "Количество прописанных, все ли в Ташкенте?",
                 "type": "string"
                 },
                 "howlongselling": {
                 "title": "Как долго.",
                 "description": "Как долго  продают",
                 "type": "string"
                 },
                 "howtosell": {
                 "title": "Как прод.",
                 "description": "Как продавали квартиру",
                 "type": "string",
                 "enum": [
                 "агентство недвижимости",
                 "частные посредники",
                 "своими силами"
                 ]
                 },
                 "whatdoyouexpect": {
                 "title": "Что Вы ждете",
                 "description": "Что Вы ждете от Агентства недвижимости",
                 "type": "string",
                 "enum": [
                 "скорость продажи",
                 "качество",
                 "юридическая чистота",
                 "безопасность",
                 "гарантии"
                 ]
                 },
                 "whenconvenient": {
                 "title": "Когда удобно",
                 "description": "Когда Вам удобно, чтобы приводили клиентов",
                 "type": "string"
                 },
                 "howurgently": {
                 "title": "Как срочно",
                 "description": "Как срочно вам необходимо продать и к какому сроку?",
                 "type": "string"
                 }
                 }
                 },
                 "rooms": {
                 "title": "Комнаты",
                 "type": "object",
                 "format": "hidden",
                 "additionalProperties": {
                 "description": "Комнаты",
                 "type": "object",
                 "properties": {
                 "area": {
                 "title": "Площадь",
                 "type": "number"
                 },
                 "floors": {
                 "title": "Полы",
                 "type": "string",
                 "enum": [
                 "дерево",
                 "линолеум",
                 "паркет",
                 "ламинат",
                 "ковролан",
                 "другое"
                 ]
                 },
                 "floorscondition": {
                 "title": "Сост. пола",
                 "description": "Состояние пола",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "walls": {
                 "title": "Стены",
                 "type": "string",
                 "enum": [
                 "обой",
                 "эмульсия",
                 "хопер",
                 "другое"
                 ]
                 },
                 "wallscondition": {
                 "title": "Сост. стен",
                 "description": "Состояние стен",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "window": {
                 "title": "Окна",
                 "type": "string",
                 "enum": [
                 "деревянные",
                 "пластиковые",
                 "алюминиевые",
                 "другие"
                 ]
                 },
                 "windowcondition": {
                 "title": "Сост. окон",
                 "description": "Состояние окон",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "ceilings": {
                 "title": "Потолки",
                 "type": "string",
                 "enum": [
                 "навесные",
                 "гипсокартон",
                 "побелка",
                 "лепка",
                 "другие"
                 ]
                 },
                 "ceilingscondition": {
                 "title": "Сост. потол.",
                 "description": "Состояние потолков",
                 "type": "string",
                 "enum": [
                 "текут",
                 "не текут"
                 ]
                 },
                 "doors": {
                 "title": "Двери",
                 "type": "string",
                 "enum": [
                 "деревянные",
                 "МДФ",
                 "другие"
                 ]
                 },
                 "doorscondition": {
                 "title": "Сост. дверей",
                 "description": "Состояние дверей",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "furniturestays": {
                 "title": "Меб. ост.",
                 "description": "Мебель остается",
                 "type": "string",
                 "enum": [
                 "да",
                 "нет"
                 ]
                 },
                 "furniture": {
                 "title": "Мебель",
                 "type": "array",
                 "items": {
                 "type": "string",
                 "enum": [
                 "столы",
                 "стулья",
                 "диван",
                 "кресла",
                 "кровать",
                 "шкаф",
                 "шифоньер",
                 "журнальный столик",
                 "зеркала"
                 ]
                 }
                 },
                 "furniturecondition": {
                 "title": "Сост. меб.",
                 "description": "Состояние мебели",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "appliancestays": {
                 "title": "Быт. тех.  ост.",
                 "description": "Бытовая техника  остается",
                 "type": "string",
                 "enum": [
                 "да",
                 "нет"
                 ]
                 },
                 "appliances": {
                 "title": "Быт. тех.",
                 "description": "Бытовая техника",
                 "type": "array",
                 "items": {
                 "type": "string",
                 "enum": [
                 "телевизор",
                 "двд-плэйер",
                 "музыкальная система",
                 "другая"
                 ]
                 }
                 },
                 "appliancescondition": {
                 "title": "Сост. быт. тех.",
                 "description": "Состояние бытовой техники",
                 "type": "string",
                 "enum": [
                 "новая",
                 "б/у"
                 ]
                 },
                 "sanitaryequipment": {
                 "title": "Сантехника",
                 "type": "string",
                 "enum": [
                 "пластиковые трубы",
                 "металлические",
                 "другие"
                 ]
                 },
                 "saneqcondition": {
                 "title": "Сост. сантех.",
                 "description": "Состояние сантехники",
                 "type": "string",
                 "enum": [
                 "новая",
                 "б/у"
                 ]
                 },
                 "heating": {
                 "title": "Отопл.",
                 "type": "string",
                 "enum": [
                 "чугун",
                 "радиатор",
                 "регистр",
                 "алюминий",
                 "пластик"
                 ]
                 },
                 "heatingquality": {
                 "title": "Кач. отоп.",
                 "description": "Качество отопления",
                 "type": "string",
                 "enum": [
                 "горячее",
                 "среднее",
                 "нет"
                 ]
                 }
                 }
                 }
                 },
                 "kitchen": {
                 "title": "Кухни",
                 "type": "object",
                 "format": "hidden",
                 "additionalProperties": {
                 "description": "Кухни",
                 "type": "object",
                 "properties": {
                 "location": {
                 "title": "Расположение",
                 "type": "string",
                 "enum": [
                 "на своем месте",
                 "вынесена на балкон"
                 ]
                 },
                 "area": {
                 "title": "Площадь",
                 "type": "number"
                 },
                 "stove": {
                 "title": "Плита",
                 "type": "enum",
                 "options": [
                 "газовая",
                 "электрическая"
                 ]
                 },
                 "floors": {
                 "title": "Полы",
                 "type": "string",
                 "enum": [
                 "дерево",
                 "линолеум",
                 "паркет",
                 "ламинат",
                 "ковролан",
                 "кафель"
                 ]
                 },
                 "floorscondition": {
                 "title": "Сост. пола",
                 "description": "Состояние пола",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "walls": {
                 "title": "Стены",
                 "type": "string",
                 "enum": [
                 "обой",
                 "эмульсия",
                 "хопер",
                 "кафель"
                 ]
                 },
                 "wallscondition": {
                 "title": "Сост. стен",
                 "description": "Состояние стен",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "window": {
                 "title": "Окна",
                 "type": "string",
                 "enum": [
                 "деревянные",
                 "пластиковые",
                 "алюминиевые",
                 "другие"
                 ]
                 },
                 "windowcondition": {
                 "title": "Сост. окон",
                 "description": "Состояние окон",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "ceilings": {
                 "title": "Потолки",
                 "type": "string",
                 "enum": [
                 "навесные",
                 "гипсокартон",
                 "побелка",
                 "лепка",
                 "кафель"
                 ]
                 },
                 "ceilingscondition": {
                 "title": "Сост. потол.",
                 "description": "Состояние потолков",
                 "type": "string",
                 "enum": [
                 "текут",
                 "не текут"
                 ]
                 },
                 "doors": {
                 "title": "Двери",
                 "type": "string",
                 "enum": [
                 "деревянные",
                 "МДФ",
                 "другие"
                 ]
                 },
                 "doorscondition": {
                 "title": "Сост. дверей",
                 "description": "Состояние дверей",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "furniturestays": {
                 "title": "Меб. ост.",
                 "description": "Мебель остается",
                 "type": "string",
                 "enum": [
                 "да",
                 "нет"
                 ]
                 },
                 "furniture": {
                 "title": "Мебель",
                 "type": "array",
                 "items": {
                 "type": "string",
                 "enum": [
                 "столы",
                 "стулья",
                 "диван",
                 "кресла"
                 ]
                 }
                 },
                 "furniturecondition": {
                 "title": "Сост. меб.",
                 "description": "Состояние мебели",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "appliancestays": {
                 "title": "Быт. тех.  ост.",
                 "description": "Бытовая техника  остается",
                 "type": "string",
                 "enum": [
                 "да",
                 "нет"
                 ]
                 },
                 "appliances": {
                 "title": "Быт. тех.",
                 "description": "Бытовая техника",
                 "type": "array",
                 "items": {
                 "type": "string",
                 "enum": [
                 "микроволновая печь",
                 "стиральная машина",
                 "холодильник",
                 "посудомоечная машина",
                 "телевизор"
                 ]
                 }
                 },
                 "appliancescondition": {
                 "title": "Сост. быт. тех.",
                 "description": "Состояние бытовой техники",
                 "type": "string",
                 "enum": [
                 "новая",
                 "б/у"
                 ]
                 },
                 "sanitaryequipment": {
                 "title": "Сантехника",
                 "type": "string",
                 "enum": [
                 "пластиковые трубы",
                 "металлические",
                 "другие"
                 ]
                 },
                 "saneqcondition": {
                 "title": "Сост. сантех.",
                 "description": "Состояние сантехники",
                 "type": "string",
                 "enum": [
                 "новая",
                 "б/у"
                 ]
                 },
                 "heating": {
                 "title": "Отопл.",
                 "type": "string",
                 "enum": [
                 "чугун",
                 "радиатор",
                 "регистр",
                 "алюминий",
                 "пластик"
                 ]
                 },
                 "heatingquality": {
                 "title": "Кач. отоп.",
                 "description": "Качество отопления",
                 "type": "string",
                 "enum": [
                 "горячее",
                 "среднее",
                 "нет"
                 ]
                 }
                 }
                 }
                 },
                 "balcony": {
                 "title": "Балконы",
                 "type": "object",
                 "format": "hidden",
                 "additionalProperties": {
                 "description": "Балконы",
                 "type": "object",
                 "properties": {
                 "location": {
                 "title": "Расположение",
                 "type": "string",
                 "enum": [
                 "лоджия",
                 "вынесена кухня",
                 "сушилка"
                 ]
                 },
                 "area": {
                 "title": "Площадь",
                 "type": "number"
                 },
                 "floors": {
                 "title": "Полы",
                 "type": "string",
                 "enum": [
                 "дерево",
                 "линолеум",
                 "паркет",
                 "ламинат",
                 "ковролан",
                 "кафель"
                 ]
                 },
                 "floorscondition": {
                 "title": "Сост. пола",
                 "description": "Состояние пола",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "walls": {
                 "title": "Стены",
                 "type": "string",
                 "enum": [
                 "обой",
                 "эмульсия",
                 "хопер",
                 "кафель"
                 ]
                 },
                 "wallscondition": {
                 "title": "Сост. стен",
                 "description": "Состояние стен",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "window": {
                 "title": "Окна",
                 "type": "string",
                 "enum": [
                 "деревянные",
                 "пластиковые",
                 "алюминиевые",
                 "другие"
                 ]
                 },
                 "windowcondition": {
                 "title": "Сост. окон",
                 "description": "Состояние окон",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "ceilings": {
                 "title": "Потолки",
                 "type": "string",
                 "enum": [
                 "навесные",
                 "гипсокартон",
                 "побелка",
                 "лепка",
                 "кафель"
                 ]
                 },
                 "ceilingscondition": {
                 "title": "Сост. потол.",
                 "description": "Состояние потолков",
                 "type": "string",
                 "enum": [
                 "текут",
                 "не текут"
                 ]
                 },
                 "doors": {
                 "title": "Двери",
                 "type": "string",
                 "enum": [
                 "деревянные",
                 "МДФ",
                 "другие"
                 ]
                 },
                 "doorscondition": {
                 "title": "Сост. дверей",
                 "description": "Состояние дверей",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "furniturestays": {
                 "title": "Меб. ост.",
                 "description": "Мебель остается",
                 "type": "string",
                 "enum": [
                 "да",
                 "нет"
                 ]
                 },
                 "furniture": {
                 "title": "Мебель",
                 "type": "array",
                 "items": {
                 "type": "string",
                 "enum": [
                 "столы",
                 "стулья",
                 "диван",
                 "кресла"
                 ]
                 }
                 },
                 "furniturecondition": {
                 "title": "Сост. меб.",
                 "description": "Состояние мебели",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "appliancestays": {
                 "title": "Быт. тех.  ост.",
                 "description": "Бытовая техника  остается",
                 "type": "string",
                 "enum": [
                 "да",
                 "нет"
                 ]
                 },
                 "appliances": {
                 "title": "Быт. тех.",
                 "description": "Бытовая техника",
                 "type": "array",
                 "items": {
                 "type": "string",
                 "enum": [
                 "микроволновая печь",
                 "стиральная машина",
                 "холодильник",
                 "посудомоечная машина",
                 "телевизор"
                 ]
                 }
                 },
                 "appliancescondition": {
                 "title": "Сост. быт. тех.",
                 "description": "Состояние бытовой техники",
                 "type": "string",
                 "enum": [
                 "новая",
                 "б/у"
                 ]
                 },
                 "sanitaryequipment": {
                 "title": "Сантехника",
                 "type": "string",
                 "enum": [
                 "пластиковые трубы",
                 "металлические",
                 "другие"
                 ]
                 },
                 "saneqcondition": {
                 "title": "Сост. сантех.",
                 "description": "Состояние сантехники",
                 "type": "string",
                 "enum": [
                 "новая",
                 "б/у"
                 ]
                 },
                 "heating": {
                 "title": "Отопл.",
                 "type": "string",
                 "enum": [
                 "чугун",
                 "радиатор",
                 "регистр",
                 "алюминий",
                 "пластик"
                 ]
                 },
                 "heatingquality": {
                 "title": "Кач. отоп.",
                 "description": "Качество отопления",
                 "type": "string",
                 "enum": [
                 "горячее",
                 "среднее",
                 "нет"
                 ]
                 }
                 }
                 }
                 },
                 "wc": {
                 "title": "Санузлы",
                 "type": "object",
                 "format": "hidden",
                 "additionalProperties": {
                 "description": "Санузлы",
                 "type": "object",
                 "properties": {
                 "area": {
                 "title": "Площадь",
                 "type": "number"
                 },
                 "bathroom": {
                 "title": "Ванная",
                 "type": "string",
                 "enum": [
                 "стандартная",
                 "сидячая",
                 "джакузи",
                 "душевая кабинка"
                 ]
                 },
                 "bathroomcondition": {
                 "title": "Состояние ванной",
                 "type": "string",
                 "enum": [
                 "новая",
                 "б/у"
                 ]
                 },
                 "toiletcondition": {
                 "title": "Состояние унитаза",
                 "type": "string",
                 "enum": [
                 "новый",
                 "б/у"
                 ]
                 },
                 "floors": {
                 "title": "Полы",
                 "type": "string",
                 "enum": [
                 "дерево",
                 "линолеум",
                 "паркет",
                 "ламинат",
                 "ковролан",
                 "кафель"
                 ]
                 },
                 "floorscondition": {
                 "title": "Сост. пола",
                 "description": "Состояние пола",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "walls": {
                 "title": "Стены",
                 "type": "string",
                 "enum": [
                 "обой",
                 "эмульсия",
                 "хопер",
                 "кафель"
                 ]
                 },
                 "wallscondition": {
                 "title": "Сост. стен",
                 "description": "Состояние стен",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "window": {
                 "title": "Окна",
                 "type": "string",
                 "enum": [
                 "деревянные",
                 "пластиковые",
                 "алюминиевые",
                 "другие"
                 ]
                 },
                 "windowcondition": {
                 "title": "Сост. окон",
                 "description": "Состояние окон",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "ceilings": {
                 "title": "Потолки",
                 "type": "string",
                 "enum": [
                 "навесные",
                 "гипсокартон",
                 "побелка",
                 "лепка",
                 "кафель"
                 ]
                 },
                 "ceilingscondition": {
                 "title": "Сост. потол.",
                 "description": "Состояние потолков",
                 "type": "string",
                 "enum": [
                 "текут",
                 "не текут"
                 ]
                 },
                 "doors": {
                 "title": "Двери",
                 "type": "string",
                 "enum": [
                 "деревянные",
                 "МДФ",
                 "другие"
                 ]
                 },
                 "doorscondition": {
                 "title": "Сост. дверей",
                 "description": "Состояние дверей",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "sanitaryequipment": {
                 "title": "Сантехника",
                 "type": "string",
                 "enum": [
                 "пластиковые трубы",
                 "металлические",
                 "другие"
                 ]
                 },
                 "saneqcondition": {
                 "title": "Сост. сантех.",
                 "description": "Состояние сантехники",
                 "type": "string",
                 "enum": [
                 "новая",
                 "б/у"
                 ]
                 },
                 "heating": {
                 "title": "Отопл.",
                 "type": "string",
                 "enum": [
                 "теплый пол",
                 "чугун",
                 "радиатор",
                 "регистр",
                 "алюминий",
                 "пластик"
                 ]
                 },
                 "heatingquality": {
                 "title": "Кач. отоп.",
                 "description": "Качество отопления",
                 "type": "string",
                 "enum": [
                 "горячее",
                 "среднее",
                 "нет"
                 ]
                 }
                 }
                 }
                 },
                 "corridor": {
                 "title": "Коридоры",
                 "type": "object",
                 "format": "hidden",
                 "additionalProperties": {
                 "description": "Коридоры",
                 "type": "object",
                 "properties": {
                 "area": {
                 "title": "Площадь",
                 "type": "number"
                 },
                 "floors": {
                 "title": "Полы",
                 "type": "string",
                 "enum": [
                 "дерево",
                 "линолеум",
                 "паркет",
                 "ламинат",
                 "ковролан",
                 "кафель"
                 ]
                 },
                 "floorscondition": {
                 "title": "Сост. пола",
                 "description": "Состояние пола",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "walls": {
                 "title": "Стены",
                 "type": "string",
                 "enum": [
                 "обой",
                 "эмульсия",
                 "хопер",
                 "кафель"
                 ]
                 },
                 "wallscondition": {
                 "title": "Сост. стен",
                 "description": "Состояние стен",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "window": {
                 "title": "Окна",
                 "type": "string",
                 "enum": [
                 "деревянные",
                 "пластиковые",
                 "алюминиевые",
                 "другие"
                 ]
                 },
                 "windowcondition": {
                 "title": "Сост. окон",
                 "description": "Состояние окон",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "ceilings": {
                 "title": "Потолки",
                 "type": "string",
                 "enum": [
                 "навесные",
                 "гипсокартон",
                 "побелка",
                 "лепка",
                 "кафель"
                 ]
                 },
                 "ceilingscondition": {
                 "title": "Сост. потол.",
                 "description": "Состояние потолков",
                 "type": "string",
                 "enum": [
                 "текут",
                 "не текут"
                 ]
                 },
                 "doors": {
                 "title": "Двери",
                 "type": "string",
                 "enum": [
                 "деревянные",
                 "МДФ",
                 "другие"
                 ]
                 },
                 "doorscondition": {
                 "title": "Сост. дверей",
                 "description": "Состояние дверей",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "furniture": {
                 "title": "Мебель",
                 "type": "array",
                 "items": {
                 "type": "string",
                 "enum": [
                 "встроенная мебель",
                 "столы",
                 "стулья",
                 "диван",
                 "кресла",
                 "кровать",
                 "шкаф",
                 "шифоньер",
                 "журнальный столик",
                 "зеркала"
                 ]
                 }
                 },
                 "furniturecondition": {
                 "title": "Сост. меб.",
                 "description": "Состояние мебели",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "sanitaryequipment": {
                 "title": "Сантехника",
                 "type": "string",
                 "enum": [
                 "пластиковые трубы",
                 "металлические",
                 "другие"
                 ]
                 },
                 "saneqcondition": {
                 "title": "Сост. сантех.",
                 "description": "Состояние сантехники",
                 "type": "string",
                 "enum": [
                 "новая",
                 "б/у"
                 ]
                 },
                 "heating": {
                 "title": "Отопл.",
                 "type": "string",
                 "enum": [
                 "теплый пол",
                 "чугун",
                 "радиатор",
                 "регистр",
                 "алюминий",
                 "пластик"
                 ]
                 },
                 "heatingquality": {
                 "title": "Кач. отоп.",
                 "description": "Качество отопления",
                 "type": "string",
                 "enum": [
                 "горячее",
                 "среднее",
                 "нет"
                 ]
                 }
                 }
                 }
                 },
                 "additionalpremises": {
                 "title": "Дополнительное помещение",
                 "type": "object",
                 "format": "hidden",
                 "additionalProperties": {
                 "description": "Дополнительное помещение",
                 "type": "object",
                 "properties": {
                 "area": {
                 "title": "Площадь",
                 "type": "number"
                 },
                 "floors": {
                 "title": "Полы",
                 "type": "string",
                 "enum": [
                 "дерево",
                 "линолеум",
                 "паркет",
                 "ламинат",
                 "ковролан",
                 "кафель"
                 ]
                 },
                 "floorscondition": {
                 "title": "Сост. пола",
                 "description": "Состояние пола",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "walls": {
                 "title": "Стены",
                 "type": "string",
                 "enum": [
                 "обой",
                 "эмульсия",
                 "хопер",
                 "кафель"
                 ]
                 },
                 "wallscondition": {
                 "title": "Сост. стен",
                 "description": "Состояние стен",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "window": {
                 "title": "Окна",
                 "type": "string",
                 "enum": [
                 "деревянные",
                 "пластиковые",
                 "алюминиевые",
                 "другие"
                 ]
                 },
                 "windowcondition": {
                 "title": "Сост. окон",
                 "description": "Состояние окон",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "ceilings": {
                 "title": "Потолки",
                 "type": "string",
                 "enum": [
                 "навесные",
                 "гипсокартон",
                 "побелка",
                 "лепка",
                 "кафель"
                 ]
                 },
                 "ceilingscondition": {
                 "title": "Сост. потол.",
                 "description": "Состояние потолков",
                 "type": "string",
                 "enum": [
                 "текут",
                 "не текут"
                 ]
                 },
                 "doors": {
                 "title": "Двери",
                 "type": "string",
                 "enum": [
                 "деревянные",
                 "МДФ",
                 "другие"
                 ]
                 },
                 "doorscondition": {
                 "title": "Сост. дверей",
                 "description": "Состояние дверей",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "furniture": {
                 "title": "Мебель",
                 "type": "array",
                 "items": {
                 "type": "string",
                 "enum": [
                 "встроенная мебель",
                 "столы",
                 "стулья",
                 "диван",
                 "кресла",
                 "кровать",
                 "шкаф",
                 "шифоньер",
                 "журнальный столик",
                 "зеркала"
                 ]
                 }
                 },
                 "furniturecondition": {
                 "title": "Сост. меб.",
                 "description": "Состояние мебели",
                 "type": "string",
                 "enum": [
                 "новые",
                 "б/у"
                 ]
                 },
                 "sanitaryequipment": {
                 "title": "Сантехника",
                 "type": "string",
                 "enum": [
                 "пластиковые трубы",
                 "металлические",
                 "другие"
                 ]
                 },
                 "saneqcondition": {
                 "title": "Сост. сантех.",
                 "description": "Состояние сантехники",
                 "type": "string",
                 "enum": [
                 "новая",
                 "б/у"
                 ]
                 },
                 "heating": {
                 "title": "Отопл.",
                 "type": "string",
                 "enum": [
                 "теплый пол",
                 "чугун",
                 "радиатор",
                 "регистр",
                 "алюминий",
                 "пластик"
                 ]
                 },
                 "heatingquality": {
                 "title": "Кач. отоп.",
                 "description": "Качество отопления",
                 "type": "string",
                 "enum": [
                 "горячее",
                 "среднее",
                 "нет"
                 ]
                 }
                 }
                 }
                 }*/
            }
        }
    }
};