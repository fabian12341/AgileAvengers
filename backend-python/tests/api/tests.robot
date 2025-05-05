*** Settings ***
Library           RequestsLibrary
Library           OperatingSystem
Library           JSONLibrary
Library           Collections

*** Variables ***
${BASE_URL}       https://agileavengers-2.onrender.com
${API_KEY}        ${EMPTY}

*** Test Cases ***
Cargar API Key
    ${API_KEY}=   Get Environment Variable    API_KEY
    Set Suite Variable    ${API_KEY}
Get Clients (GET /clients)
    ${headers}=    Create Dictionary    X-API-KEY    ${API_KEY}
    Create Session    backend    ${BASE_URL}    headers=${headers}
    ${response}=    GET On Session    backend    /clients
    Should Be Equal As Strings    ${response.status_code}    200
    ${clientes}=    Set Variable    ${response.json()}
    FOR    ${cliente}    IN    @{clientes}
        Dictionary Should Contain Key    ${cliente}    id_client
        Dictionary Should Contain Key    ${cliente}    name
    END

Get Calls (GET /calls)
    ${headers}=    Create Dictionary    X-API-KEY    ${API_KEY}
    Create Session    backend    ${BASE_URL}    headers=${headers}
    ${response}=    GET On Session    backend    /calls
    Should Be Equal As Strings    ${response.status_code}    200
    Dictionary Should Contain Key    ${response.json()[0]}    id

Get Calls with Users (GET /calls/users)
    ${headers}=    Create Dictionary    X-API-KEY    ${API_KEY}
    Create Session    backend    ${BASE_URL}    headers=${headers}
    ${response}=    GET On Session    backend    /calls/users
    Should Be Equal As Strings    ${response.status_code}    200
    Dictionary Should Contain Key    ${response.json()[0]}    user

Get Reports (GET /reports)
    ${headers}=    Create Dictionary    X-API-KEY    ${API_KEY}
    Create Session    backend    ${BASE_URL}    headers=${headers}
    ${response}=    GET On Session    backend    /reports
    Should Be Equal As Strings    ${response.status_code}    200
    Dictionary Should Contain Key    ${response.json()[0]}    summary

Delete Invalid Report (DELETE /reports/0)
    ${headers}=    Create Dictionary    X-API-KEY    ${API_KEY}
    Create Session    backend    ${BASE_URL}    headers=${headers}
    ${response}=    DELETE On Session    backend    /reports/0    expected_status=any
    Should Be Equal As Strings    ${response.status_code}    404
