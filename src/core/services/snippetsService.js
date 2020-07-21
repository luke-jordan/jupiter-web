
export class SnippetsService {
    constructor(apiService) {
        this.apiService = apiService;
        this.url = process.env.REACT_APP_ADMIN_URL;
    }

    getSnippets(params) {
        return this.apiService.get(`${this.url}/snippet/read/list`, { params });       
    }

    createSnippet(snippetData) {
        return this.apiService.post(`${this.url}/snippet/create`, snippetData);
    }

    fetchSnippet(snippetId) {
        return this.apiService.get(`${this.url}/snippet/read/view`, { params: { snippetId } });
    }

}