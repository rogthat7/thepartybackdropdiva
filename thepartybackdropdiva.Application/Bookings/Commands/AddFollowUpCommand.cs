using MediatR;
using thepartybackdropdiva.Domain.Entities;
using thepartybackdropdiva.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace thepartybackdropdiva.Application.Bookings.Commands;

public record AddFollowUpCommand(Guid BookingId, string Note, string AdminName) : IRequest<bool>;

public class AddFollowUpHandler : IRequestHandler<AddFollowUpCommand, bool>
{
    private readonly AppDbContext _context;

    public AddFollowUpHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(AddFollowUpCommand request, CancellationToken cancellationToken)
    {
        var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == request.BookingId, cancellationToken);
        if (booking == null) return false;

        var followUp = new FollowUp
        {
            BookingId = request.BookingId,
            Note = request.Note,
            AdminName = request.AdminName
        };

        booking.Status = "Following Up";
        _context.FollowUps.Add(followUp);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
