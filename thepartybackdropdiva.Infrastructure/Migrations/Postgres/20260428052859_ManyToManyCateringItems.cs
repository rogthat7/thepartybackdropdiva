using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace thepartybackdropdiva.Infrastructure.Migrations.Postgres
{
    /// <inheritdoc />
    public partial class ManyToManyCateringItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceItems_CateringMenus_CateringMenuId",
                table: "ServiceItems");

            migrationBuilder.DropIndex(
                name: "IX_ServiceItems_CateringMenuId",
                table: "ServiceItems");

            migrationBuilder.DropColumn(
                name: "CateringMenuId",
                table: "ServiceItems");

            migrationBuilder.CreateTable(
                name: "CateringMenuMenuItem",
                columns: table => new
                {
                    CateringMenusId = table.Column<Guid>(type: "uuid", nullable: false),
                    MenuItemsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CateringMenuMenuItem", x => new { x.CateringMenusId, x.MenuItemsId });
                    table.ForeignKey(
                        name: "FK_CateringMenuMenuItem_CateringMenus_CateringMenusId",
                        column: x => x.CateringMenusId,
                        principalTable: "CateringMenus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CateringMenuMenuItem_ServiceItems_MenuItemsId",
                        column: x => x.MenuItemsId,
                        principalTable: "ServiceItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CateringMenuMenuItem_MenuItemsId",
                table: "CateringMenuMenuItem",
                column: "MenuItemsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CateringMenuMenuItem");

            migrationBuilder.AddColumn<Guid>(
                name: "CateringMenuId",
                table: "ServiceItems",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceItems_CateringMenuId",
                table: "ServiceItems",
                column: "CateringMenuId");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceItems_CateringMenus_CateringMenuId",
                table: "ServiceItems",
                column: "CateringMenuId",
                principalTable: "CateringMenus",
                principalColumn: "Id");
        }
    }
}
