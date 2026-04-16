using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace thepartybackdropdiva.Infrastructure.Migrations.Postgres
{
    /// <inheritdoc />
    public partial class AddAdvisorAndConsultationAssignmentsPostgres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "BookingId",
                table: "FollowUps",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<Guid>(
                name: "ConsultationRequestId",
                table: "FollowUps",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Advisors",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Specialization = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Advisors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Advisors_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AdvisorActiveConsultations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AdvisorId = table.Column<Guid>(type: "uuid", nullable: false),
                    ConsultationRequestId = table.Column<Guid>(type: "uuid", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdvisorActiveConsultations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AdvisorActiveConsultations_Advisors_AdvisorId",
                        column: x => x.AdvisorId,
                        principalTable: "Advisors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AdvisorActiveConsultations_ConsultationRequests_Consultatio~",
                        column: x => x.ConsultationRequestId,
                        principalTable: "ConsultationRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FollowUps_ConsultationRequestId",
                table: "FollowUps",
                column: "ConsultationRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_AdvisorActiveConsultations_AdvisorId",
                table: "AdvisorActiveConsultations",
                column: "AdvisorId");

            migrationBuilder.CreateIndex(
                name: "IX_AdvisorActiveConsultations_ConsultationRequestId",
                table: "AdvisorActiveConsultations",
                column: "ConsultationRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_Advisors_UserId",
                table: "Advisors",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_FollowUps_ConsultationRequests_ConsultationRequestId",
                table: "FollowUps",
                column: "ConsultationRequestId",
                principalTable: "ConsultationRequests",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FollowUps_ConsultationRequests_ConsultationRequestId",
                table: "FollowUps");

            migrationBuilder.DropTable(
                name: "AdvisorActiveConsultations");

            migrationBuilder.DropTable(
                name: "Advisors");

            migrationBuilder.DropIndex(
                name: "IX_FollowUps_ConsultationRequestId",
                table: "FollowUps");

            migrationBuilder.DropColumn(
                name: "ConsultationRequestId",
                table: "FollowUps");

            migrationBuilder.AlterColumn<Guid>(
                name: "BookingId",
                table: "FollowUps",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);
        }
    }
}
