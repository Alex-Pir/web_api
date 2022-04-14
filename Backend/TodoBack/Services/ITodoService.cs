using TodoBack.Domain;
using TodoBack.Dto;

namespace TodoBack.Services
{
    public interface ITodoService
    {
        List<Todo> GetTodos();
        Todo GetTodo( int todoId );
        int CompleteTodo( int todoId );
        int CreateTodo( TodoDto todo );
        void DeleteTodo( int todoId );
    }
}
