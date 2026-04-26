using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace thepartybackdropdiva.Infrastructure.Migrations.Postgres
{
    /// <inheritdoc />
    public partial class AddConsultationEventFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "EventDate",
                table: "ConsultationRequests",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EventType",
                table: "ConsultationRequests",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GuestCount",
                table: "ConsultationRequests",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "ConsultationRequests",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ServicesInterested",
                table: "ConsultationRequests",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VenueLocation",
                table: "ConsultationRequests",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EventDate",
                table: "ConsultationRequests");

            migrationBuilder.DropColumn(
                name: "EventType",
                table: "ConsultationRequests");

            migrationBuilder.DropColumn(
                name: "GuestCount",
                table: "ConsultationRequests");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "ConsultationRequests");

            migrationBuilder.DropColumn(
                name: "ServicesInterested",
                table: "ConsultationRequests");

            migrationBuilder.DropColumn(
                name: "VenueLocation",
                table: "ConsultationRequests");
        }
    }
}
