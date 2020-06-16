/**********************************************************
* Module contains API-links consts.
* hostUrl - link to calculate service
* dbServiceUrl - link to web backend service
*
*
* Модуль со ссылками на API сервисов
* hostUrl - сервис справочников и расчета изделия
* dbServiceUrl - бэкэнд сайта и сервис хранения БД акканутов пользователей
***********************************************************/


const hostUrl="http://localhost:30500";
export const dbServiceUrl="http://localhost:30000";

export const steelTypesUrl = hostUrl+"/api/config/read?&path=dictionaries.steel_types"
export const productListUrl = hostUrl+"/api/types?bytarget=unf_product_t&title=1"
export const fieldsUrl = hostUrl+"/api/types?&bytarget=unf_product_t&title=1&input_schema=1"
export const dictionaryUrl = hostUrl+"/api/config/read?&path="
export const calcUrl = hostUrl+"/api/call?&target=unf_product_t&source="
export const unitsUrl = hostUrl+"/api/config/read?path=dictionaries.units"
export const materialTypesUrl = hostUrl+"/api/config/read?path=dictionaries.material_types"

export const getCurrentUserUrl = dbServiceUrl+"/get-current-user";
export const registryUserUrl = dbServiceUrl+"/registry-user";
export const changePasswordUrl = dbServiceUrl+"/change-password";
export const remindPassUrl = dbServiceUrl+"/remind-pass";
export const loginUserUrl = dbServiceUrl+"/login-user";
export const logoutUserUrl = dbServiceUrl+"/logout-user";