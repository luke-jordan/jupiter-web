import { tap } from 'rxjs/operators';

export class SnippetsService {
    constructor(apiService) {
        this.apiService = apiService;
        this.url = process.env.REACT_APP_ADMIN_URL;
    }

    getSnippets(params) {
        return this.apiService.get(`${this.url}/snippet/read/list`, { params }).pipe(
            tap(this._transformSnippets)
        );       
    }

    createSnippet(snippetData) {
        return this.apiService.post(`${this.url}/snippet/create`, snippetData);
    }

    _transformSnippets = (snippets) => {
        console.log('Snippets: ', snippets);
    }

}