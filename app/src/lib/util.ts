export function sortPerformances(performances: { createdAt: string }[]) {
    return performances.sort((a, b) => {
        return new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1;
    });
}