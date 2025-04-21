export default function RepoDetail({ repoItem }) {
    console.log(repoItem);
    return (
        <div>
            <h1>{repoItem.name}</h1>
            <em>{repoItem.ownerUsername}</em>
        </div>
    )
}