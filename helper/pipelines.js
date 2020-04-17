exports.cummStatePipeline = [
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
  {
    $sort: { _id: 1 },
  },
];

exports.cummTotalpipeline = [
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
      _id: 0,
    },
  },
];
