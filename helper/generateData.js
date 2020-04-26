/* const data = {
  'Abuja FCT': 23,
  Abia: 0,
  Adamawa: 23,
  'Akwa Ibom': 7,
  Anambra: 23,
  Bauchi: 7,
  Bayelsa: 23,
  Benue: 0,
  Borno: 5,
  'Cross River': 7,
  Delta: 2,
  Ebonyi: 23,
  Edo: 3,
  Ekiti: 23,
  Enugu: 4,
  Gombe: 1,
  Imo: 2,
  Jigawa: 0,
  Kaduna: 23,
  Kano: 23,
  Katsina: 0,
  Kebbi: 0,
  Kogi: 0,
  Kwara: 23,
  Lagos: 0,
  Nassarawa: 2,
  Niger: 23,
  Ogun: 23,
  Ondo: 0,
  Osun: 3,
  Oyo: 5,
  Plateau: 2,
  Rivers: 2,
  Sokoto: 23,
  Taraba: 0,
  Yobe: 1,
  Zamfara: 0,
  discharged: 24,
  deaths: 10,
}; */

/* const switchCases = {
  cases: {
    $switch: {
      branches: genPutPipeline(states),
    },
  },
}; */
const southEast = ['Anambra', 'Abia', 'Ebonyi', 'Enugu', 'Imo'];
const northCentral = ['Benue', 'Kogi', 'Kwara', 'Nassarawa', 'Niger', 'Plateau', 'Abuja'];
const northEast = ['Adamawa', 'Bauchi', 'Borno', 'Gombe', 'Taraba', 'Yobe'];
const northWest = ['Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Sokoto', 'Zamfara'];
const southSouth = ['Akwa Ibom', 'Bayelsa', 'Cross River', 'Rivers', 'Delta', 'Edo'];
const southWest = ['Ekiti', 'Lagos', 'Ogun', 'Ondo', 'Osun', 'Oyo'];

const cleanStateParam = (param) => param.split(' ')
  .map((name) => name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase())
  .join(' ');

const getdate = (a) => {
  const arr = a.split('-').map((val) => parseInt(val, 10));
  return new Date(arr[0], arr[1] - 1, arr[2]);
};

const getRegion = (state) => {
  if (southEast.includes(state)) return 'South East';
  if (northCentral.includes(state)) return 'North Central';
  if (northEast.includes(state)) return 'North East';
  if (northWest.includes(state)) return 'North West';
  if (southSouth.includes(state)) return 'South South';
  if (southWest.includes(state)) return 'South West';
  return null;
};

const cleanData = (data) => {
  let sum = 0;
  const { date } = data;
  const states = [];
  const summary = {};
  Object.keys(data).map((key) => {
    if (key === 'discharged' || key === 'deaths') {
      summary[key] = data[key];
    } else if (key !== 'date') {
      sum += data[key];
      const obj = {};
      obj.state = key;
      obj.cases = data[key];
      obj.date = getdate(date);
      obj.region = getRegion(key);
      states.push(obj);
    }
    return key;
  });
  summary.cases = sum;

  return {
    date: getdate(date),
    states,
    summary,
  };
};

const genNatData = (summary, date) => {
  const { cases, discharged, deaths } = summary;
  return {
    date,
    cases,
    discharged,
    deaths,
  };
};

const handleQuery = (query) => {
  const arrQueries = Object.keys(query);

  if ((arrQueries.length === 1 && arrQueries.includes('accumulate'))
    || arrQueries.length === 0) return null;

  if (arrQueries.includes('date')) {
    const date = getdate(query.date);
    return {
      $match: { date },
    };
  }

  if (arrQueries.includes('to') && arrQueries.includes('from')) {
    const from = getdate(query.from);
    const to = getdate(query.to);
    const date = {
      $match: {},
    };
    date.$match.date = from > to
      // eslint-disable-next-line no-undef
      ? { $gte: to, $lte: from }
      : { $lte: to, $gte: from };
    return date;
  }
  throw new Error('Please provide the right queries, you can either use "date" or "to" and "from" together to get a range');
};

const generateStatePipeLine = (query, params) => {
  const state = cleanStateParam(params.state);
  const queryObj = handleQuery(query);
  const pipeline = [
    {
      $match: {
        state,
      },
    }, {
      $sort: {
        date: -1,
      },
    }, {
      $project: {
        __v: 0,
      },
    },
  ];
  const cummPipline = [
    {
      $group: {
        _id: '$state',
        cases: {
          $sum: '$cases',
        },
      },
    },
    {
      $addFields: {
        state: '$_id',
      },
    },
  ];
  const sortPipeline = {
    $sort: {
      date: -1,
    },
  };

  if (queryObj) pipeline.push(queryObj, sortPipeline);
  if (query.accumulate) return [...pipeline, ...cummPipline];
  return pipeline;
};

const generateRegionPipeLine = (query, params) => {
  const region = cleanStateParam(params.region);
  const queryObj = handleQuery(query);
  const pipeline = [
    {
      $match: {
        region,
      },
    }, {
      $sort: {
        date: -1,
      },
    }, {
      $project: {
        __v: 0,
      },
    },
  ];
  const groupByDate = {
    $group: {
      _id: '$date',
      cases: {
        $sum: '$cases',
      },
    },
  };
  const addRegionField = {
    $addFields: {
      date: '$_id',
    },
  };
  const cummPipline = [
    {
      $group: {
        _id: '$region',
        cases: {
          $sum: '$cases',
        },
      },
    },
    {
      $addFields: {
        region: '$_id',
      },
    },
  ];
  const sortPipeline = {
    $sort: {
      date: -1,
    },
  };
  if (queryObj) pipeline.push(queryObj, groupByDate, addRegionField, sortPipeline);
  if (query.accumulate) return [...pipeline, ...cummPipline];
  return pipeline;
};

const generateNatPipeline = (querys) => {
  const pipeline = [{ $project: { __v: 0 } },
    { $sort: { date: -1 } }];
  const cummPipline = [
    {
      $group: {
        _id: null,
        cases: {
          $sum: '$cases',
        },
        deaths: {
          $sum: '$deaths',
        },
        discharged: {
          $sum: '$discharged',
        },
      },
    }, {
      $project: {
        _id: false,
      },
    },

  ];
  if (Object.keys(querys).length === 0) return pipeline;

  if ((Object.keys(querys).length === 1)
    && querys.accumulate) return [...pipeline, ...cummPipline];

  const query = handleQuery(querys);
  if (querys.accumulate) return [query, ...cummPipline];

  return [query, { $sort: { date: 1 } }];
};

const genPutPipeline = (states) => states.map((state) => ({
  case: { $eq: ['state', state.state] },
  then: state.cases,
}));

module.exports = {
  cleanData,
  genNatData,
  generateStatePipeLine,
  generateRegionPipeLine,
  generateNatPipeline,
  genPutPipeline,
};
