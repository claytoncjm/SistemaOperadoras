using Microsoft.EntityFrameworkCore;
using Sistema_de_Gestao_Telecom.Models;

namespace Sistema_de_Gestao_Telecom.Data
{
    public class ApplicationDbContext : DbContext
    {
        // Construtor que recebe as opções de configuração do banco de dados
        // As opções são injetadas pelo sistema de DI do ASP.NET Core
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Operadora> Operadoras { get; set; }
        public DbSet<Contrato> Contratos { get; set; }
        public DbSet<Fatura> Faturas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurações adicionais do modelo de dados
            // Aqui definimos relacionamentos, índices e restrições
            base.OnModelCreating(modelBuilder);

            // Configurações adicionais de modelo podem ser adicionadas aqui
            modelBuilder.Entity<Operadora>()
                .HasMany(o => o.Contratos)
                .WithOne(c => c.Operadora)
                .HasForeignKey(c => c.OperadoraId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Contrato>()
                .HasMany(c => c.Faturas)
                .WithOne(f => f.Contrato)
                .HasForeignKey(f => f.ContratoId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
