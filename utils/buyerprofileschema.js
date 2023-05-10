var schem =
    {
        "buyer": {
            "schema": {
                "$schema": "http://json-schema.org/draft-03/schema#",
                "type": "object",
                "properties": {
                    "maininfo": {
                        "type": "object",
                        "title": "Основная информация",
                        "format": "hidden",
                        "properties": {
                            "customerdata": {
                                "title": "Ф.И.О",
                                "description": "Ф.И.О заказчика (как обращаться)",
                                "type": "string",
                                "required": true
                            },
                            "customertel": {
                                "type": "array",
                                "title": "Телефон",
                                //"c": "c",
                                "description": "Телефон заказчика",
                                "items": {
                                    "type": "string",
                                    "format": "tel",
                                    "description": "Телефон заказчика"
                                }
                            },
                            "customerdatafull": {
                                "title": "Заказчики",
                                "description": "Группа заказчиков",
                                "type": "array",
                                // "c": "c",
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
                                        /*"customerdata": {
                                            "type": "object",
                                            "title": "Инф",
                                            "description": "информация о заказчике",
                                            "properties": {
                                                "customername": {
                                                    "title": "Имя",
                                                    "description": "Ф.И.О заказчика (как обращаться)",
                                                    "type": "string"
                                                },
                                                "customertel": {
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
                                        }*/

                                    }
                                }
                            }
                        }
                    }
                    ,
                    "customerpersonalinformation": {
                        "type": "object",
                        "title": "Личные данные владельца",
                        "format": "hidden",
                        "properties": {
                            /*"coownerdata": {
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
                            },*/
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
                                "description": "Кто принимает решение о покупке квартиры и об окончательной цене?",
                                "type": "string"
                            },
                            /*"matching": {
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
                            },*/
                            "additionalrealestate": {
                                "title": "Налич. доп. недв.",
                                "description": "Наличие дополнительной продаваемой недвижимости",
                                "type": "string",
                                "enum": [
                                    "да",
                                    "нет"
                                ]
                            },
                            "howlonglooking": {
                                "title": "Как долго.",
                                "description": "Как долго ищут",
                                "type": "string"
                            },
                            /*"vacateaftersale": {
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
                            },*/
                            "whatdoyouexpect": {
                                "title": "Что Вы ждете",
                                "description": "Что Вы ждете от Агентства недвижимости",
                                "type": "string",
                                "enum": [
                                    "скорость покупки",
                                    "качество",
                                    "юридическая чистота",
                                    "безопасность",
                                    "гарантии"
                                ]
                            },
                            "whenconvenient": {
                                "title": "Когда удобно",
                                "description": "Когда Вам удобно, чтобы показать",
                                "type": "string"
                            },
                            "howurgently": {
                                "title": "Как срочно",
                                "description": "Как срочно вам необходимо купить и к какому сроку?",
                                "type": "string"
                            },
                            "remark": {
                                "title": "Заметки",
                                "description": "Заметки",
                                "type": "string",
                                "format": "text"
                            },

                        }
                    }
                }
            }
        }
    };