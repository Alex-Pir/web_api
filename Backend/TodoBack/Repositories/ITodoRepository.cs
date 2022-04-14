using TodoBack.Domain;

namespace TodoBack.Repositories
{
    public interface ITodoRepository
    {
        List<Todo> GetTodos();
        Todo? Get( int id );
        int Create( Todo todo );
        void Delete( Todo todo );
        int Update( Todo todo );
    }
}
