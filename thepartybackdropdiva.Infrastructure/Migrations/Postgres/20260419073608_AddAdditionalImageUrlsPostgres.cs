using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace thepartybackdropdiva.Infrastructure.Migrations.Postgres
{
    /// <inheritdoc />
    public partial class AddAdditionalImageUrlsPostgres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string[]>(
                name: "AdditionalImageUrls",
                table: "BackdropImages",
                type: "text[]",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdditionalImageUrls",
                table: "BackdropImages");
        }
    }
}
