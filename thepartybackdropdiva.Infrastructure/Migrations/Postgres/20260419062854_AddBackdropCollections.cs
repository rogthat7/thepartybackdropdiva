using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace thepartybackdropdiva.Infrastructure.Migrations.Postgres
{
    /// <inheritdoc />
    public partial class AddBackdropCollections : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BackdropCollections",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    CoverImageUrl = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BackdropCollections", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BackdropImages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BackdropCollectionId = table.Column<Guid>(type: "uuid", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BackdropImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BackdropImages_BackdropCollections_BackdropCollectionId",
                        column: x => x.BackdropCollectionId,
                        principalTable: "BackdropCollections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BackdropImages_BackdropCollectionId",
                table: "BackdropImages",
                column: "BackdropCollectionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BackdropImages");

            migrationBuilder.DropTable(
                name: "BackdropCollections");
        }
    }
}
