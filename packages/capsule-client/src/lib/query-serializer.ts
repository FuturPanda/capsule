export class QuerySerializer {
  serializeQuery(queryOptions: any) {
    const serialized: any = {};

    if (queryOptions.select) {
      serialized.select = {
        fields: Array.isArray(queryOptions.select)
          ? queryOptions.select
          : [queryOptions.select],
      };
    }

    if (queryOptions.where) {
      serialized.where = {};
      Object.entries(queryOptions.where).forEach(([field, condition]) => {
        serialized.where[field] = this.transformCondition(condition);
      });
    }

    if (queryOptions.pagination) {
      serialized.pagination = queryOptions.pagination;
    }

    if (queryOptions.orderBy) {
      serialized.orderBy = {};
      Object.entries(queryOptions.orderBy).forEach(([field, direction]) => {
        serialized.orderBy[field] = direction;
      });
    }
    console.log("serialized:", serialized);
    return serialized;
  }
  private transformCondition(condition: any) {
    if (typeof condition !== "object" || condition === null) {
      return { operator: "eq", value: condition === null ? "null" : condition };
    }

    const operatorKey = Object.keys(condition).find((key) =>
      key.startsWith("$"),
    );

    if (operatorKey) {
      const operator = operatorKey.substring(1);
      return {
        operator,
        value:
          condition[operatorKey] === null ? "null" : condition[operatorKey],
      };
    }

    return { operator: "eq", value: condition === null ? "null" : condition };
  }
}
