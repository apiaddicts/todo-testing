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

