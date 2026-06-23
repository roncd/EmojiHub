---
title: EmojiHub API v1.0.0
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
highlight_theme: darkula
headingLevel: 2

---

<!-- Generator: Widdershins v4.0.1 -->

<h1 id="emojihub-api">EmojiHub API v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Documentation API du projet EmojiHub

<h1 id="emojihub-api-emoji">Emoji</h1>

Endpoints liés aux emojis

## post__emoji

> Code samples

```shell
# You can also use wget
curl -X POST /emoji \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

```http
POST /emoji HTTP/1.1

Content-Type: application/json
Accept: application/json

```

```javascript
const inputBody = '{
  "emoji": "😂",
  "utilisateur": "rosalie",
  "message": "trop drôle !"
}';
const headers = {
  'Content-Type':'application/json',
  'Accept':'application/json'
};

fetch('/emoji',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Content-Type' => 'application/json',
  'Accept' => 'application/json'
}

result = RestClient.post '/emoji',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

r = requests.post('/emoji', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Content-Type' => 'application/json',
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('POST','/emoji', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/emoji");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("POST");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Content-Type": []string{"application/json"},
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("POST", "/emoji", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`POST /emoji`

*Enregistre un emoji*

> Body parameter

```json
{
  "emoji": "😂",
  "utilisateur": "rosalie",
  "message": "trop drôle !"
}
```

<h3 id="post__emoji-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|body|body|[EmojiInput](#schemaemojiinput)|true|none|

> Example responses

> 201 Response

```json
{
  "id": 42,
  "emoji": "😂",
  "utilisateur": "rosalie",
  "message": "trop drôle !",
  "created_at": "2019-08-24T14:15:22Z"
}
```

<h3 id="post__emoji-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|Emoji enregistré avec succès|[EmojiResponse](#schemaemojiresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Données invalides|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<aside class="success">
This operation does not require authentication
</aside>

## get__emoji_random

> Code samples

```shell
# You can also use wget
curl -X GET /emoji/random \
  -H 'Accept: application/json'

```

```http
GET /emoji/random HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/emoji/random',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/emoji/random',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/emoji/random', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/emoji/random', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/emoji/random");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/emoji/random", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /emoji/random`

*Renvoie un emoji aléatoire*

> Example responses

> 200 Response

```json
{
  "emoji": "🔥"
}
```

<h3 id="get__emoji_random-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Emoji aléatoire renvoyé|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Aucun emoji enregistré|None|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="get__emoji_random-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» emoji|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## get__emoji_stats

> Code samples

```shell
# You can also use wget
curl -X GET /emoji/stats \
  -H 'Accept: application/json'

```

```http
GET /emoji/stats HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/emoji/stats',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/emoji/stats',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/emoji/stats', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/emoji/stats', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/emoji/stats");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/emoji/stats", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /emoji/stats`

*Renvoie les statistiques globales des emojis*

> Example responses

> 200 Response

```json
{
  "total": 152,
  "top": [
    {
      "emoji": "😂",
      "count": 42
    }
  ],
  "stats": {
    "happy_sad_score": 0.78,
    "frequences_per_hour": {
      "14": 12,
      "15": 20
    }
  }
}
```

<h3 id="get__emoji_stats-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Statistiques globales|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="get__emoji_stats-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» total|integer|false|none|none|
|» top|[object]|false|none|none|
|»» emoji|string|false|none|none|
|»» count|integer|false|none|none|
|» stats|object|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

<h1 id="emojihub-api-monitoring">Monitoring</h1>

Endpoints de monitoring et métriques

## get__metrics

> Code samples

```shell
# You can also use wget
curl -X GET /metrics \
  -H 'Accept: application/json'

```

```http
GET /metrics HTTP/1.1

Accept: application/json

```

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/metrics',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

```ruby
require 'rest-client'
require 'json'

headers = {
  'Accept' => 'application/json'
}

result = RestClient.get '/metrics',
  params: {
  }, headers: headers

p JSON.parse(result)

```

```python
import requests
headers = {
  'Accept': 'application/json'
}

r = requests.get('/metrics', headers = headers)

print(r.json())

```

```php
<?php

require 'vendor/autoload.php';

$headers = array(
    'Accept' => 'application/json',
);

$client = new \GuzzleHttp\Client();

// Define array of request body.
$request_body = array();

try {
    $response = $client->request('GET','/metrics', array(
        'headers' => $headers,
        'json' => $request_body,
       )
    );
    print_r($response->getBody()->getContents());
 }
 catch (\GuzzleHttp\Exception\BadResponseException $e) {
    // handle exception or api errors.
    print_r($e->getMessage());
 }

 // ...

```

```java
URL obj = new URL("/metrics");
HttpURLConnection con = (HttpURLConnection) obj.openConnection();
con.setRequestMethod("GET");
int responseCode = con.getResponseCode();
BufferedReader in = new BufferedReader(
    new InputStreamReader(con.getInputStream()));
String inputLine;
StringBuffer response = new StringBuffer();
while ((inputLine = in.readLine()) != null) {
    response.append(inputLine);
}
in.close();
System.out.println(response.toString());

```

```go
package main

import (
       "bytes"
       "net/http"
)

func main() {

    headers := map[string][]string{
        "Accept": []string{"application/json"},
    }

    data := bytes.NewBuffer([]byte{jsonReq})
    req, err := http.NewRequest("GET", "/metrics", data)
    req.Header = headers

    client := &http.Client{}
    resp, err := client.Do(req)
    // ...
}

```

`GET /metrics`

*Renvoie les métriques du service API*

> Example responses

> 200 Response

```json
{
  "service": "api-service",
  "total_emojis": 152,
  "timestamp": "2019-08-24T14:15:22Z"
}
```

<h3 id="get__metrics-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Métriques du service|Inline|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Erreur serveur|None|

<h3 id="get__metrics-responseschema">Response Schema</h3>

Status Code **200**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» service|string|false|none|none|
|» total_emojis|integer|false|none|none|
|» timestamp|string(date-time)|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_EmojiInput">EmojiInput</h2>
<!-- backwards compatibility -->
<a id="schemaemojiinput"></a>
<a id="schema_EmojiInput"></a>
<a id="tocSemojiinput"></a>
<a id="tocsemojiinput"></a>

```json
{
  "emoji": "😂",
  "utilisateur": "rosalie",
  "message": "trop drôle !"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|emoji|string|true|none|none|
|utilisateur|string|false|none|none|
|message|string|false|none|none|

<h2 id="tocS_EmojiResponse">EmojiResponse</h2>
<!-- backwards compatibility -->
<a id="schemaemojiresponse"></a>
<a id="schema_EmojiResponse"></a>
<a id="tocSemojiresponse"></a>
<a id="tocsemojiresponse"></a>

```json
{
  "id": 42,
  "emoji": "😂",
  "utilisateur": "rosalie",
  "message": "trop drôle !",
  "created_at": "2019-08-24T14:15:22Z"
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|id|integer|false|none|none|
|emoji|string|false|none|none|
|utilisateur|string|false|none|none|
|message|string|false|none|none|
|created_at|string(date-time)|false|none|none|

