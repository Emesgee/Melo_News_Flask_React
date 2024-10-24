"""Added lat and lon columns to User file_uplodas table


Revision ID: 1b35c82a349d
Revises: 5782f5469d04
Create Date: 2024-10-21 16:01:33.248213

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1b35c82a349d'
down_revision = '5782f5469d04'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('file_uploads', schema=None) as batch_op:
        batch_op.add_column(sa.Column('lat', sa.Float(), nullable=False))
        batch_op.add_column(sa.Column('lon', sa.Float(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('file_uploads', schema=None) as batch_op:
        batch_op.drop_column('lon')
        batch_op.drop_column('lat')

    # ### end Alembic commands ###
