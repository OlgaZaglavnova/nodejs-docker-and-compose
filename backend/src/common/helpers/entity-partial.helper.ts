/**
 * Функция возвращает объект с выбранными полями.
 * Поля указываются в виде массивав строк - наименований полей объекта entity
 * @param entity
 * @param fields
 * @returns
 */
export function getEntityPartial<T extends object, K extends keyof T>(
  entity: T,
  fields: K[],
): Pick<T, K> {
  const partialEntity = {} as Pick<T, K>;
  fields.forEach((field) => {
    if (entity[field] !== undefined) {
      partialEntity[field] = entity[field];
    }
  });
  return partialEntity;
}
