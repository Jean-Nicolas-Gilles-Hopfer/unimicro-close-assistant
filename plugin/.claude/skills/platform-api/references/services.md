# Addresses and other services

`host.api` reaches three things, told apart by how the string starts.

| What you write | Where it goes |
| --- | --- |
| `invoices` | The business API — `/api/biz/invoices` |
| `/api/statistics?model=…` | The platform host itself, for the API roots beside `/api/biz` |
| `~files/api/download?id=…` | The service that name has in the platform's endpoints document |

Anything that climbs out with `..`, names a scheme, or reaches outside `/api` on the platform host is
refused before it is sent.

## The platform host

A leading slash addresses the host the application runs on, which serves more than the business API.
`/api/statistics` is the one plugins want most often — see `references/statistics.md`. The path is
sent as written, so query strings go straight in it.

## Other services

`~name` resolves through the platform's endpoints document, which is read from the environment the
application is running on. Nothing in a plugin names a lane: on test the names resolve to test hosts,
in production to production hosts, and the same plugin build is correct in both.

| Name | Service |
| --- | --- |
| `~appframework` | The platform host, same as a leading slash |
| `~files` | File storage, upload, download, OCR |
| `~job` | The job server |
| `~integration` | The integration service |
| `~license` | Licensing and agreements |

Names are matched whatever their casing.

`~identity` and `~frontend` resolve but have nothing a plugin needs: they are the login server and the
application shell itself. `~signalr` is always empty in the document, so it is refused as an unknown
service.

The session travels with these calls exactly as it does with a business API call. A plugin never
handles a token.

## Files

Routes taken from the UniFiles service itself. The `id` in every one is the `StorageReference` of a
`File` record, not its `ID`.

| Call | Verb | Returns |
| --- | --- | --- |
| `~files/api/download?id=<ref>` | GET | The file itself. Add `attachment=false` to render inline, or `format=json`, `format=json2` or `format=html` to convert an EHF invoice. |
| `~files/api/image?id=<ref>&page=<n>` | GET | An image of one page. `width` and `height` scale it. |
| `~files/api/ocr?id=<ref>&page=<n>` | GET | Raw OCR data, as JSON. |
| `~files/api/ocr/analyze?id=<ref>&page=<n>` | GET | Interpreted OCR — supplier, amounts, dates — as JSON. `forceNewAnalysis=true` re-reads it. |
| `~files/api/file` | POST | Uploads a multipart `File`. Answers the new file record. `doocr=false` skips OCR. |
| `~files/api/file?id=<ref>` | PUT | Replaces the content of an existing file. |
| `~files/api/file/merge-files` | POST | Merges several files into one, and answers the new record. |
| `~files/api/file/delete-files` | DELETE | Takes an array of ids in the body. |
| `~files/api/file/split` / `split-multiple` | POST | Splits a file at a page. |
| `~files/api/file/filestatus/<ref>` | GET | Processing status, as JSON. |
| `~files/api/public/image?key=<companyKey>&id=<ref>` | GET | The same image without a session, for a company key. |

There is no GET on `~files/api/file`; to list the files on a business record, ask the business API
for `files/<entity>/<id>`:

```ts
const files = await host.api.get<any[]>("files/CustomerInvoice/42");
const reference = files[0]?.StorageReference;
```

**The four verbs parse every response as JSON.** The OCR, status and upload calls fit them.
`download` and `image` answer bytes, so they are read with `host.api.request`:

```ts
const pdf = await host.api.request<Blob>({
    path: "~files/api/download",
    query: { id: reference },
    responseType: "blob",
});
```

The whole response comes back: `status`, `contentType`, and `filename` when the service suggested
one. `responseType` also takes `text` — which is what `download?format=html` answers — and
`arrayBuffer`.

Uploading is the same call with a `FormData` body. **The form field must be named `File`** — that is
what the service binds, and any other name uploads nothing and still answers 200:

```ts
const form = new FormData();
form.append("File", file, file.name);

const stored = await host.api.request<any>({
    path: "~files/api/file",
    method: "POST",
    body: form,
});

const reference = stored.data.StorageReference;   // what `download` reads it back by
```

See the **host-api** skill for the headers `request` accepts and the size it refuses.
