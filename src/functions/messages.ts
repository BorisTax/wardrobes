import messages from "../server/messages"
export const rusMessages = {
  [messages.DATABASE_OPEN_ERROR]: "Ошибка базы данных",
  [messages.DATABASE_CONSTRAINT_ERROR]: "Данный материал подвязан к другому материалу.",
  [messages.SQL_QUERY_ERROR]: "Ошибка запроса к базе данных",
  [messages.DATA_UPDATED]: "Данные обновлены",
  [messages.INVALID_NAME]: "Некорректное имя",
  [messages.INVALID_PASSWORD]: "Некорректный пароль",
  [messages.INVALID_USER_DATA]: "Некорректные данные пользователя",
  [messages.IMAGE_TOO_LARGE]: "Слишком большой размер изображения",
  [messages.LOGIN_SUCCEED]: "Авторизация прошла успешно",
  [messages.ACCESS_DENIED]: "Доступ запрещен",
  [messages.MATERIAL_EXIST]: "Материал уже существует",
  [messages.MATERIAL_NO_EXIST]: "Материал не найден",
  [messages.MATERIAL_ADDED]: "Материал добавлен",
  [messages.MATERIAL_DELETED]: "Материал удален",
  [messages.MATERIAL_UPDATED]: "Материал обновлен",
  [messages.MATERIAL_LINKED]: "Данный материал привязан к другому",

  [messages.TEMPLATE_EXIST]: "Шаблон уже существует",
  [messages.TEMPLATE_NO_EXIST]: "Шаблон не найден",
  [messages.TEMPLATE_ADDED]: "Шаблон добавлен",
  [messages.TEMPLATE_DELETED]: "Шаблон удален",
  [messages.TEMPLATE_UPDATED]: "Шаблон обновлен",
  [messages.TEMPLATE_APPLY_ERROR]: "Невозможно применить данный шаблон",
  
  [messages.PERMISSION_EXIST]: "Правило уже существует",
  [messages.PERMISSION_NO_EXIST]: "Правило не найдено",
  [messages.PERMISSION_ADDED]: "Правило добавлено",
  [messages.PERMISSION_DELETED]: "Правило удалено",
  [messages.PERMISSION_UPDATED]: "Правило обновлено",

  [messages.PASSWORDS_NOT_MATCH]: "Пароли не совпадают",
  [messages.USER_ADDED]: "Пользователь добавлен",
  [messages.USER_DELETED]: "Пользователь удален",
  [messages.USER_UPDATED]: "Пользователь изменен",
  [messages.SERVER_ERROR]: "Ошибка сервера",
  [messages.USER_NAME_EXIST]: "Пользователь существует",
  [messages.USER_NAME_NO_EXIST]: "Пользователь не существует",
  [messages.USER_DELETE_DENIED]: "Нельзя удалить пользователя",
  [messages.USER_UPDATE_DENIED]: "Нельзя изменить пользователя",

  [messages.ROLE_ADDED]: "Роль добавлена",
  [messages.ROLE_DELETED]: "Роль удалена",
  [messages.ROLE_EXIST]: "Роль уже сужествует",
  [messages.ROLE_DELETE_DENIED]: "Нельзя удалить роль",

  [messages.PRICELIST_NAME_NO_EXIST]: "Материал не существует в базе",
  [messages.PRICELIST_PRICE_INCORRECT]: "Некорректная цена",
  [messages.PRICELIST_MARKUP_INCORRECT]: "Некорректная наценка",

  [messages.SPEC_NAME_NO_EXIST]: "Материал не существует в базе",
  [messages.SPEC_CAPTION_EXIST]: "Наименование уже существует",
  [messages.SPEC_CODE_EXIST]: "Код уже существует",
  [messages.SPEC_ID_EXIST]: "Идентификатор уже существует",
  [messages.SPEC_UPDATED]: "Данные обновлены",

  [messages.PASSWORD_SHORT]: "Пароль короткий (мин. 6 символов)",
  [messages.PASSWORD_INCORRECT]: "Некорректный пароль (используйте символы a-zA-Z0-9_)",

  [messages.ENTER_BRUSH]: "Выберите щетку",
  [messages.ENTER_CAPTION]: "Введите наименование",
  [messages.ENTER_CODE]: "Введите код", 
  [messages.ENTER_COEF]: "Введите коэф-т",
  [messages.ENTER_CORRESPOND]: "Введите соответствие",
  [messages.ENTER_ID]: "Введите идентификатор",
  [messages.ENTER_IMAGE]: "Выберите изображение",
  [messages.ENTER_MARKUP]: "Введите наценку",
  [messages.ENTER_PRICE]: "Введите цену",
  [messages.ENTER_PASSWORD]: "Введите пароль",
  [messages.ENTER_PURPOSE]: "Выберите назначение",
  [messages.ENTER_NAME]: "Введите имя",
}


export function boolToYesNo(value: boolean): string{
  return value ? "Да" : "Нет"
}