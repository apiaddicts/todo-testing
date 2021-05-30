import http from 'k6/http'
import { check } from 'k6'

export default function () {
  const responses = http.batch([
    ['GET', 'http://localhost:3001/api/todos'],
    ['GET', 'http://localhost:3001/api/todos?status=completed'],
    ['GET', 'http://localhost:3001/api/todos?status=uncompleted']
  ]);

  responses.forEach(response => {
    check(response, {
      'is status 200': (r) => r.status === 200
    });
  })
};

export function create() {
  const url='http://localhost:3001/api/todos';
  const payload = JSON.stringify({
    todo: 'k6 load testing'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const response = http.post(url, payload, params);
  check(response, {
    'is status 201': (r) => r.status === 201
  })
}

export let options = {
  scenarios: {
    gets: {
      executor: 'constant-vus',
      vus: 10,
      duration: '30s'
    },
    create: {
      executor: 'ramping-arrival-rate',
      exec: 'create',
      // common scenario configuration
      startTime: '10s', // the ramping API test starts a little later
      startRate: 50,
      preAllocatedVUs: 10, // how large the initial pool of VUs would be
      maxVUs: 50, // if the preAllocatedVUs are not enough, we can initialize more
      stages: [
        { target: 200, duration: '10s' }, // go from 50 to 200 iters/s in the first 10 seconds
        { target: 200, duration: '15s' }, // hold at 200 iters/s for 15 second
        { target: 0, duration: '30s' }, // ramp down back to 0 iters/s over the last 30 second
      ]
    }
  },
  thresholds: {
    http_req_failed: [ 'rate<0.01' ],
    http_req_duration: [ 'p(95)<200' ]
  }
};