import { QueryOptionsDto } from 'src/dynamic-queries/_utils/dto/request/query-options.dto';
import { WhereConditionDto } from 'src/dynamic-queries/_utils/dto/request/query-options/where-option.dto';
import { FilterQuery } from '@capsulesh/shared-types';

export function convertQueryOptionsToFilterQuery<T>(
  queryOptions?: QueryOptionsDto,
): FilterQuery<T> {
  if (!queryOptions || !queryOptions.where) {
    return {};
  }

  const filterQuery: FilterQuery<T> = {};

  for (const [field, condition] of Object.entries(queryOptions.where)) {
    filterQuery[field] = convertCondition(condition);
  }

  return filterQuery;
}

function convertCondition(condition: WhereConditionDto): any {
  const operatorMap = {
    eq: '$eq',
    neq: '$ne',
    gt: '$gt',
    gte: '$gte',
    lt: '$lt',
    lte: '$lte',
    like: '$like',
    ilike: '$ilike',
    between: '$btw',
    in: '$in',
    null: 'null',
  };

  const result = {};
  const chiselOperator = operatorMap[condition.operator];

  if (chiselOperator) {
    if (condition.not) {
      result['$not'] = { [chiselOperator]: condition.value };
    } else {
      result[chiselOperator] = condition.value;
    }
  }

  return result;
}
