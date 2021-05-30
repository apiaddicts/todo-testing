@todos-service
Feature: TODOs service
  In order manage todos
  As a developer
  I want to make sure CRUD operations through REST API work fine

  Scenario Outline: create a todo
    Given A Todo <request>
    When I send POST to /todos
    Then I get response code and schema 201

    Examples:
      | request                   |
      | {"todo": "BDD example 1"} |
      | {"todo": "BDD example 2"} |


  Scenario Outline: get todo
    Given The Todo with <id> exist
    When I send GET request to /todos
    Then I receive <response>

    Examples:
      | id                       | response                                                                                                                         |
      | 60ae63fdd1b4c6440468d1e3 | {"id":"60ae63fdd1b4c6440468d1e3","todo":"Create from integration test.","created":"2021-05-26T15:06:37.184Z","completed":false}  |
      | 60ae640eeeb3d246c093c870 | {"id":"60ae640eeeb3d246c093c870","todo":"Create from integration test.","created":"2021-05-26T15:06:54.378Z","completed":false}  |

  Scenario Outline: modify to
    Given The Todo with <id> exist
    When I send PATCH request whit a <completed> to /todos
    Then I receive <response>

    Examples:
      | id                       | completed             | response                                                                                                                         |
      | 60ae62c38ed29e34186af3c8 | { "completed": true } | {"id":"60ae62c38ed29e34186af3c8","todo":"Create from integration test.","created":"2021-05-26T15:01:23.496Z","completed":true}   |
      | 60ae63282664d2471c0b60a4 | { "completed": true } | {"id":"60ae63282664d2471c0b60a4","todo":"Exmaple from postman","created":"2021-05-26T15:03:04.618Z","completed":true}            |

  Scenario Outline: delete todo
    Given The Todo with <id> exist
    When I send DELETE request to /todos
    Then I get response code 204