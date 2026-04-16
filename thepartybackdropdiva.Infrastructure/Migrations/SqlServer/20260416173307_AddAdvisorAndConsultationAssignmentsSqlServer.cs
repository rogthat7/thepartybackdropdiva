using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace thepartybackdropdiva.Infrastructure.Migrations.SqlServer
{
    /// <inheritdoc />
    public partial class AddAdvisorAndConsultationAssignmentsSqlServer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "BookingId",
                table: "FollowUps",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<Guid>(
                name: "ConsultationRequestId",
                table: "FollowUps",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Advisors",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Specialization = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
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
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AdvisorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ConsultationRequestId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
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
                        name: "FK_AdvisorActiveConsultations_ConsultationRequests_ConsultationRequestId",
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
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);
        }
    }
}
