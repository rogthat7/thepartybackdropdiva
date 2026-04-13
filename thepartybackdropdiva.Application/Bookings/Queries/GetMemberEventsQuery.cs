using MediatR;
using Microsoft.EntityFrameworkCore;
using thepartybackdropdiva.Application.DTOs;
using thepartybackdropdiva.Infrastructure.Data;

namespace thepartybackdropdiva.Application.Bookings.Queries;

public record GetMemberEventsQuery(Guid UserId) : IRequest<List<BookingDto>>;

public class GetMemberEventsHandler : IRequestHandler<GetMemberEventsQuery, List<BookingDto>>
{
    private readonly AppDbContext _context;

    public GetMemberEventsHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<BookingDto>> Handle(GetMemberEventsQuery request, CancellationToken cancellationToken)
    {
        var bookings = await _context.Bookings
            .Include(b => b.FollowUps)
            .Where(b => b.UserId == request.UserId)
            .OrderByDescending(b => b.EventDate)
            .ToListAsync(cancellationToken);

        return bookings.Select(b => new BookingDto
        {
            Id = b.Id,
            CustomerName = b.CustomerName,
            Status = b.Status,
            EventDate = b.EventDate,
            EventLocation = b.EventLocation,
            FollowUps = b.FollowUps.OrderByDescending(f => f.CreatedAt).Select(f => new FollowUpDto
            {
                Id = f.Id,
                Note = f.Note,
                AdminName = f.AdminName,
                CreatedAt = f.CreatedAt
            }).ToList()
        }).ToList();
    }
}
