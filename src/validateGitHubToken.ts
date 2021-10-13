import GitHub from 'github-api';

export const validateGitHubToken = async (token: string): Promise<boolean> => {
    const gh = new GitHub({ token });
    const repo = gh.getRepo('usename', 'reponame');

    try {
        await repo._request('GET', `/user/repos`);
    } catch (e) {
        return false;
    }

    return true;
}