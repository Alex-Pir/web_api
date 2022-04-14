using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TodoBack.Domain;
using TodoBack.Dto;
using TodoBack.Services;

namespace TodoBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController : ControllerBase
    {
        private readonly ITodoService _todoService;

        public TodoController(ITodoService todoService)
        {
            _todoService = todoService;
        }

        [HttpGet]
        public List<TodoDto> GetAll()
        {
            List<Todo> todos = _todoService.GetTodos();

            return todos.Select(todo => new TodoDto()
            {
                Id = todo.Id,
                Title = todo.Title,
                IsDone = todo.IsDone,
            }).ToList();
        }

        [HttpPost]
        public IActionResult Create([FromBody] TodoDto todoDto)
        {
            try
            {
                int id = _todoService.CreateTodo(todoDto);
                return Ok(id);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Update([FromBody] TodoDto todoDto)
        {
            try
            {
                if (todoDto.Id == null)
                {
                    throw new Exception("Id can not be null");
                }

                _todoService.CompleteTodo((int)todoDto.Id);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok();
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete([FromRoute] int id)
        {
            try
            {
                if (id <= 0)
                {
                    throw new Exception("Id can not be negative or 0");
                }

                _todoService.DeleteTodo(id);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok();
        }
    }
}
